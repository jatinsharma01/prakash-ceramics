import { getAllBrands } from "@/lib/serverDb";
import { INITIAL_BRANDS } from "@/lib/brands";
import Link from "next/link";
import { Award, Sparkles, ArrowRight, Globe, ExternalLink, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Partner Brands & Manufacturers | PRAKASH CERAMICS",
  description:
    "Explore our complete portfolio of luxury bathroom sanitaryware, Swiss faucets, sinks, and kitchen appliance brand partners.",
};

export default async function BrandsIndexPage() {
  let brands = await getAllBrands();
  if (!brands || brands.length === 0) {
    brands = INITIAL_BRANDS;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#151a22] pb-24">
      {/* Header Banner */}
      <div className="bg-[#12161f] text-white border-b border-[#2a2f3a] pt-32 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#dec49a] mb-6 font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-white font-semibold">Partner Brands</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#dec49a] block mb-2">
              Authorized Dealerships & Manufacturing Partners
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              World-Class Architectural Brands
            </h1>
            <p className="text-sm text-stone-300 mt-3 leading-relaxed">
              We collaborate with premier sanitaryware, brassware, quartz sink, and kitchen appliance manufacturers to bring engineering precision and luxury aesthetics to your spaces.
            </p>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((b) => {
            const initials = b.name.slice(0, 2).toUpperCase();
            return (
              <div
                key={b.id || b.slug}
                className="bg-white rounded-2xl border border-[#e5e0d8] hover:border-[#9b7842]/40 hover:shadow-xl transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dec49a]/20 to-[#9b7842]/10 border border-[#9b7842]/30 flex items-center justify-center font-serif font-bold text-base text-[#836433] group-hover:bg-[#9b7842] group-hover:text-white transition-colors shrink-0">
                      {initials}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {b.name.toLowerCase() === "jaquar" && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Flagship
                        </span>
                      )}
                      {b.isFeatured && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#1f2937] group-hover:text-[#9b7842] transition-colors font-serif">
                    {b.name}
                  </h3>

                  <p className="text-xs text-[#6b7280] line-clamp-3 leading-relaxed mt-2 min-h-[48px]">
                    {b.description || `${b.name} architectural sanitaryware & bath fixtures.`}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ede8df] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8c7764]">
                    {b.itemCount ? `${b.itemCount} Products` : "Partner Brand"}
                  </span>

                  <Link
                    href={`/brands/${b.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#9b7842] hover:text-[#543e20] transition-colors"
                  >
                    <span>View Products</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
