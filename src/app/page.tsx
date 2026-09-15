import { AboutSection } from "@/components/site/about-section";
import { ContactSection } from "@/components/site/contact-section";
import { FaqSection } from "@/components/site/faq-section";
import { Footer } from "@/components/site/footer";
import { GallerySection } from "@/components/site/gallery-section";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { ServicesSection } from "@/components/site/services-section";
import { TeamSection } from "@/components/site/team-section";
import {
  getActiveServices,
  getActiveStaff,
  getBusinessSettings,
  getPublicGalleryPhotos,
} from "@/lib/supabase/queries";

export default async function Home() {
  const [business, services, staff, galleryPhotos] = await Promise.all([
    getBusinessSettings(),
    getActiveServices(),
    getActiveStaff(),
    getPublicGalleryPhotos(),
  ]);

  return (
    <>
      <Navbar />
      {/* Footer fica fora do <main> pra manter o papel de landmark
          "contentinfo" (perde esse papel se aninhado dentro de main).
          `.signature-divider` (ver ANEXO seção 3, globals.css) marca a
          transição entre seções principais — mesma assinatura visual usada,
          em maior escala, na troca de rota (route-transition.tsx). */}
      <main id="conteudo" className="flex flex-1 flex-col">
        <Hero business={business} />
        <div aria-hidden="true" className="signature-divider" />
        <AboutSection staffCount={staff.length} servicesCount={services.length} />
        <div aria-hidden="true" className="signature-divider" />
        <ServicesSection services={services} />
        <TeamSection staff={staff} />
        <div aria-hidden="true" className="signature-divider" />
        <GallerySection photos={galleryPhotos} />
        <FaqSection />
        <ContactSection business={business} />
      </main>
      <Footer business={business} services={services} />
    </>
  );
}
