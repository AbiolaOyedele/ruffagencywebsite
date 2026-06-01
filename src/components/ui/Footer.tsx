import type { GlobalData } from '@/types/cms'

interface FooterProps {
  global: GlobalData
}

/**
 * Site-wide footer.
 * Background colour is controlled by --color-footer-bg, set per page via inline <style>.
 */
export function Footer({ global }: FooterProps) {
  const year = global.footer.copyright_year ?? new Date().getFullYear()

  return (
    <div className="relative bg-[var(--color-footer-bg)] text-brand-black z-20 ~py-12/20">
      <div className="page-container">
        <div className="lg:px-page flex flex-col ~gap-y-12/36">
          <h3 className="text-4xl lg:~text-5xl/[5.625rem] font-semibold leading-none tracking-tight text-balance">
            Get in touch
          </h3>

          <div className="flex flex-col ~gap-y-10/16">
            <div className="grid md:grid-cols-3 gap-y-11 gap-x-5">
              <p className="~text-lg/2xl text-pretty">
                Jobs &amp; Opportunities
                <br />
                <a className="text-link font-bold" href="/scoops">
                  Browse openings
                </a>
              </p>
              <p className="~text-lg/2xl text-pretty md:text-center">
                Clients &amp; New business
                <br />
                <a
                  className="text-link font-bold"
                  href={`mailto:${global.footer.new_business_email}`}
                >
                  {global.footer.new_business_email}
                </a>
              </p>
              <p className="~text-lg/2xl text-pretty md:text-right">
                For anything else
                <br />
                <a className="text-link font-bold" href="/contact">
                  All enquiries
                </a>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row-reverse md:justify-between gap-10 ~text-lg/2xl">
              <div className="flex lg:justify-end flex-wrap ~gap-x-5/10">
                <a
                  href={global.social.instagram || '#'}
                  className="font-bold hover:underline decoration-[3px] underline-offset-4 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href={global.social.linkedin || '#'}
                  className="font-bold hover:underline decoration-[3px] underline-offset-4 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href={global.social.tiktok || '#'}
                  className="font-bold hover:underline decoration-[3px] underline-offset-4 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
                <a
                  href={global.social.youtube || '#'}
                  className="font-bold hover:underline decoration-[3px] underline-offset-4 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </div>

              <div className="flex flex-col lg:flex-row gap-y-4 ~gap-x-5/10">
                <p>
                  The Ruff Agency &copy;{year}. All rights reserved.
                </p>
                <div className="flex ~gap-x-5/10">
                  <a href="#" className="hover:underline decoration-[3px] underline-offset-4 transition">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:underline decoration-[3px] underline-offset-4 transition">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
