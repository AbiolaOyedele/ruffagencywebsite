-- ─────────────────────────────────────────────────────────────
-- Seed data — mirrors production defaults from cms.ts
-- ─────────────────────────────────────────────────────────────

-- Global settings
insert into ruff_settings (key, value) values
  ('global.site',       '{"name":"The Ruff Agency","description":"The Ruff Agency is an animation studio in London.","maintenance_mode":false}'),
  ('global.social',     '{"instagram":"https://instagram.com/theruffagency","linkedin":"#","tiktok":"#","youtube":"#"}'),
  ('global.footer',     '{"new_business_email":"newbusiness@theruff.agency","general_email":"hello@theruff.agency","copyright_year":2026}'),
  ('global.navigation', '[{"label":"Work","href":"/work","overlay_bg_color":"#e92038","text_hover_color":"#feb3d2"},{"label":"About","href":"/about","overlay_bg_color":"#2dc05e","text_hover_color":"#c9faa8"},{"label":"Scoop","href":"/scoops","overlay_bg_color":"#7c65fe","text_hover_color":"#fffde0"},{"label":"Contact","href":"/contact","overlay_bg_color":"#fd7b33","text_hover_color":"#fffde0"}]'),
  ('page.home',         '{"accent_fg":"254 179 210","accent_bg":"99 77 255","footer_bg":"rgb(213,193,255)","hero_image_url":"/images/hero.jpg","intro_heading":"Creative Rebellion","intro_subheading":"in every pixel","intro_body":"We''re The Ruff Agency, an animation and design studio based in London, UK. With a love for character, distilled design and pixel-perfect motion, we create expressive work for brands and agencies of all sizes.","cta_text":"Find out more about us","cta_href":"/about","marquee_bg_color":"213 243 255"}'),
  ('page.work',         '{"accent_fg":"233 32 56","accent_bg":"233 32 56","footer_bg":"rgb(255,220,225)","intro_heading":"Our Work","intro_body":"Animation and design for the world''s most ambitious brands."}'),
  ('page.about',        '{"accent_fg":"45 192 84","accent_bg":"45 192 84","footer_bg":"rgb(201,250,168)","hero_image_url":"/images/about-hero.jpg","intro_heading":"We are The Ruff Agency","intro_body":"An animation and design studio based in London with a love for character, distilled design and pixel-perfect motion.","studio_pill":"Studio","studio_text_1":"We are a team of animators, illustrators and designers based in London, UK.","studio_text_2":"We work with brands of all sizes, from startups to global corporations.","studio_image_1_url":"/images/studio-1.jpg","studio_image_2_url":"/images/studio-2.jpg","capabilities_col1":["Animation","Illustration","Motion Design","Brand Identity"],"capabilities_col2":["Character Design","3D Animation","Social Content","Storyboarding"],"team_image_1_url":"/images/team-1.jpg","team_image_2_url":"/images/team-2.jpg","full_width_image_url":"/images/team-full.jpg","about_text_1":"Founded in 2015, The Ruff Agency has grown into one of London''s most exciting animation studios.","about_text_2":"Our work spans broadcast, digital, social and brand — always with character at its core."}'),
  ('page.contact',      '{"accent_fg":"253 123 51","accent_bg":"253 123 51","footer_bg":"rgb(255,220,200)","intro_heading":"Say hello","intro_body":"We''d love to hear from you.","new_business_heading":"Want to work together?","new_business_description":"Tell us about your project and we''ll get back to you within 24 hours.","new_business_email":"newbusiness@theruff.agency","jobs_heading":"Join the team","jobs_description":"We''re always looking for talented people to join us.","jobs_link":"#","general_heading":"Everything else","general_description":"Got a question? We''re happy to chat.","general_email":"hello@theruff.agency","studio_address":"The Ruff Agency\nLondon, UK"}'),
  ('page.scoops',       '{"accent_fg":"124 101 254","accent_bg":"124 101 254","footer_bg":"rgb(220,213,255)","intro_heading":"Scoops","intro_body":"Jobs, news and updates from The Ruff Agency.","speculative_heading":"Don''t see the right role? Send us a speculative application.","speculative_button_text":"Get in touch","speculative_email":"hello@theruff.agency"}')
on conflict (key) do nothing;

-- Projects
insert into ruff_projects (slug, title, client, description, bg_color, image_url, href, categories, is_featured, sort_order, published) values
  ('lego-build-day',    'LEGO Build Day',       'LEGO',     'A social campaign to get people building together',         '#ffcd00', '/images/projects/lego-build-day/Lego.png',               '/work/lego-build-day',    array['featured','ads'],    true,  0, true),
  ('apple-seollal',     'Apple Seollal',         'Apple',    'Dancing into the Korean New Year!',                         '#c9faa8', '/images/projects/apple-seollal/Apple.png',               '/work/apple-seollal',     array['featured','ads'],    false, 1, true),
  ('dropbox-presents',  'Dropbox Presents',      'Dropbox',  'Capturing the creative process for Hollywood',             '#feb3d2', '/images/projects/dropbox-presents/Dropbox-Presents.png', '/work/dropbox-presents',  array['ads'],               false, 2, true),
  ('youtube-shopping',  'YouTube Shopping',      'YouTube',  'An illustration system to liven up in-app shopping',       '#d5f3ff', '/images/projects/youtube-shopping/Youtube.png',          '/work/youtube-shopping',  array['design'],            false, 3, true)
on conflict (slug) do nothing;

-- Testimonials
insert into ruff_testimonials (quote, credit, sort_order, published) values
  ('<p>In-house creative departments are looking for studios that possess a unicorn combination of technical expertise, creative stamina, and collaborative spirit. The Ruff Agency embodies these qualities in spades.</p>', '<p>Jonathan Lee, Meta</p>',              0, true),
  ('<p>The Ruff Agency are animation wizards, super professional, and can even make Zoom chats a pleasure. After our first commission was complete, we immediately booked in two more.</p>',                                 '<p>Procreate</p>',                        1, true),
  ('<p>Their team brought an incredible level of creativity and organization to every step of the process, making collaboration seamless and inspiring.</p>',                                                                '<p>Kim Nguyen, YouTube</p>',              2, true),
  ('<p>Not only is their work super creative and the team super organised, they are a lovely bunch of people who made every interaction delightful!</p>',                                                                    '<p>Charlotte Riley, CYLNDR</p>',          3, true),
  ('<p>Professional &amp; brilliantly creative, they were true problem solvers. Briefing was seamless, their approach clearly communicated.</p>',                                                                           '<p>Raluca Anastasiu, adam&amp;eveDDB</p>', 4, true)
on conflict do nothing;

-- Client logos
insert into ruff_client_logos (title, image_url, sort_order, published) values
  ('Adam and eve DDB',      '/images/homepage/Adam-and-eve-DDB-logo.svg',                  0,  true),
  ('Ogilvy',                '/images/homepage/Ogilvy-logo.svg',                            1,  true),
  ('WeTransfer',            '/images/homepage/WeTransfer-logo.svg',                        2,  true),
  ('Google',                '/images/homepage/Google-logo.svg',                            3,  true),
  ('Meta',                  '/images/homepage/Meta-logo.svg',                              4,  true),
  ('Samsung',               '/images/homepage/Samsung-logo.svg',                           5,  true),
  ('Airbnb',                '/images/homepage/Airbnb-logo.svg',                            6,  true),
  ('Figma',                 '/images/homepage/Figma-logo.svg',                             7,  true),
  ('BBC',                   '/images/homepage/BBC-logo.svg',                               8,  true),
  ('Netflix',               '/images/homepage/Netflix-logo.svg',                           9,  true),
  ('Procreate',             '/images/homepage/Procreate-logo.svg',                         10, true),
  ('Apple',                 '/images/homepage/AppleLogo-WebsiteV3.svg',                    11, true),
  ('Dropbox',               '/images/homepage/Dropbox-logo.svg',                           12, true),
  ('Collins',               '/images/homepage/Collins-logo.svg',                           13, true),
  ('Mailchimp',             '/images/homepage/Mailchimp-logo.svg',                         14, true),
  ('Jones Knowles Ritchie', '/images/homepage/Jones-Knowles-Ritchie-letters-logo.svg',     15, true),
  ('Net-a-Porter',          '/images/homepage/Net-a-Porter-logo.svg',                      16, true),
  ('Wolff Olins',           '/images/homepage/Wolff-Olins-Animade.svg',                    17, true),
  ('Wise',                  '/images/homepage/Wise-logo.svg',                              18, true),
  ('AKQA',                  '/images/homepage/AKQA-logo.svg',                              19, true),
  ('IBM',                   '/images/homepage/IBM-logo.svg',                               20, true),
  ('CoppaFeel',             '/images/homepage/CoppaFeel-logo.svg',                         21, true),
  ('Klarna',                '/images/homepage/Klarna-logo.svg',                            22, true),
  ('Duolingo',              '/images/homepage/Duolingo-logo.svg',                          23, true)
on conflict do nothing;
