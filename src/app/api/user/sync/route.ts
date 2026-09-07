import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/userAuth";
import {
  getUserCartAndWishlist,
  saveUserCartAndWishlist,
  getGuestCartAndWishlist,
  saveGuestCartAndWishlist,
} from "@/lib/userDb";

const GUEST_COOKIE_NAME = "pc_guest_id";

function parseJsonSafe(val: string | null | undefined, fallback: any[] = []): any[] {
  if (!val) return fallback;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestIdCookie = cookieStore.get(GUEST_COOKIE_NAME)?.value;

    if (user) {
      // User is logged in: read from permanent user account in DB
      const data = await getUserCartAndWishlist(user.id);
      let userCart = parseJsonSafe(data.cart);
      let userWishlist = parseJsonSafe(data.wishlist);

      // If there is any guest session data from before logging in, merge it in
      if (guestIdCookie) {
        const guestData = await getGuestCartAndWishlist(guestIdCookie);
        const guestCart = parseJsonSafe(guestData.cart);
        const guestWishlist = parseJsonSafe(guestData.wishlist);

        let merged = false;
        if (guestCart.length > 0) {
          const cartKeys = new Set(userCart.map((i: any) => `${i.product?.id}-${i.selectedFinish}`));
          for (const item of guestCart) {
            const key = `${item.product?.id}-${item.selectedFinish}`;
            if (!cartKeys.has(key)) {
              userCart.push(item);
              cartKeys.add(key);
              merged = true;
            }
          }
        }

        if (guestWishlist.length > 0) {
          const wishIds = new Set(userWishlist.map((p: any) => p.id));
          for (const p of guestWishlist) {
            if (!wishIds.has(p.id)) {
              userWishlist.push(p);
              wishIds.add(p.id);
              merged = true;
            }
          }
        }

        if (merged) {
          await saveUserCartAndWishlist(user.id, {
            cart: JSON.stringify(userCart),
            wishlist: JSON.stringify(userWishlist),
          });
        }
      }

      const response = NextResponse.json({
        success: true,
        authenticated: true,
        user: { id: user.id, name: user.name, email: user.email },
        cart: userCart,
        wishlist: userWishlist,
      });

      // Clear guest cookie once merged into logged in user
      if (guestIdCookie) {
        response.cookies.delete(GUEST_COOKIE_NAME);
      }

      return response;
    }

    // Guest user: read from guest session in DB
    if (guestIdCookie) {
      const data = await getGuestCartAndWishlist(guestIdCookie);
      return NextResponse.json({
        success: true,
        authenticated: false,
        cart: parseJsonSafe(data.cart),
        wishlist: parseJsonSafe(data.wishlist),
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: false,
      cart: [],
      wishlist: [],
    });
  } catch (error: any) {
    console.error("GET /api/user/sync error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch user cart/wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    let guestId = cookieStore.get(GUEST_COOKIE_NAME)?.value;

    const body = await request.json();
    const cartStr = body.cart !== undefined ? (typeof body.cart === "string" ? body.cart : JSON.stringify(body.cart)) : undefined;
    const wishlistStr = body.wishlist !== undefined ? (typeof body.wishlist === "string" ? body.wishlist : JSON.stringify(body.wishlist)) : undefined;

    if (user) {
      // 1. Authenticated customer: save directly to CustomerUser in PostgreSQL / DB
      await saveUserCartAndWishlist(user.id, {
        cart: cartStr,
        wishlist: wishlistStr,
      });

      return NextResponse.json({
        success: true,
        authenticated: true,
        message: "Saved to user database account successfully",
      });
    }

    // 2. Guest user: ensure guestId exists and store to database
    let isNewGuest = false;
    if (!guestId) {
      guestId = `gst_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      isNewGuest = true;
    }

    await saveGuestCartAndWishlist(guestId, {
      cart: cartStr,
      wishlist: wishlistStr,
    });

    const response = NextResponse.json({
      success: true,
      authenticated: false,
      message: "Saved to guest database session successfully",
    });

    if (isNewGuest) {
      response.cookies.set(GUEST_COOKIE_NAME, guestId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 60, // 60 days
      });
    }

    return response;
  } catch (error: any) {
    console.error("POST /api/user/sync error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to sync user cart/wishlist" },
      { status: 500 }
    );
  }
}
