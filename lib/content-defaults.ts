// Default site copy. The admin can override any of these via the dashboard;
// values are stored in the site_content table keyed by the same keys.
// Public pages merge DB overrides over these defaults.

export const CONTENT_DEFAULTS: Record<string, string> = {
  // Brand / contact
  'brand.tagline': 'Artistic & Portrait Photography',
  'contact.email': 'misuenophoto@gmail.com',
  'contact.location': 'Based in Bryan, Ohio',

  // Home
  'home.hero.eyebrow': 'Artistic & Portrait Photography',
  'home.hero.title': 'Capturing your dream, one frame at a time',
  'home.hero.subtitle':
    "Mi Sueño by Angi Scott is a celebration of life's quiet, beautiful moments — told with a refined, cinematic eye.",
  'home.vision.eyebrow': 'The Vision',
  'home.vision.title':
    'Timeless imagery crafted with intention, light, and a love for the stories that make us who we are.',
  'home.vision.body':
    'From intimate portraits to candid lifestyle sessions and celebrations, every photograph is made to feel as genuine as the moment it captures — elegant, warm, and unmistakably yours.',
  'home.cta.eyebrow': "Let's Create",
  'home.cta.title': 'Ready to tell your story?',

  // About
  'about.eyebrow': 'The Photographer',
  'about.title': "Hi, I'm Angi Scott",
  'about.p1':
    'Mi Sueño — "my dream" — is exactly what photography has always been to me. What began as a love for capturing the people and places I cherished grew into a calling to help others hold onto their own most precious moments.',
  'about.p2':
    'My work spans portraits, couples, families, events, and the quiet lifestyle moments in between. Whatever the occasion, my goal is the same: to create images that feel honest, elegant, and full of the emotion you felt when they were taken.',
  'about.p3':
    "When I'm not behind the camera, you'll find me chasing golden-hour light, exploring new places, and finding beauty in the everyday.",
  'about.quote':
    "The best photographs aren't just seen — they're felt. That's the dream I chase in every frame.",
}

export type ContentMap = Record<string, string>
