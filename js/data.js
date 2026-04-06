/* =============================================
   Kay's Originals — Shared Data Layer
   ============================================= */

var KaysData = (function () {
  'use strict';

  /* ---- Artists ---- */
  var artists = [
    {
      id: 'picasso',
      name: 'Pablo Picasso',
      media: 'Painting & Sculpture',
      photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
      bio: 'Pablo Ruiz Picasso (1881\u20131973) was a Spanish painter, sculptor, printmaker, ceramicist, and theatre designer who spent most of his adult life in France. He is widely regarded as one of the most influential artists of the 20th century and is known for co-founding the Cubist movement. His prolific output includes over 20,000 paintings, prints, drawings, sculptures, ceramics, and textiles, spanning a career of more than seven decades. Among his most celebrated works are the proto-Cubist Les Demoiselles d\'Avignon and the anti-war masterpiece Guernica, which remains a powerful symbol of the horrors of conflict.',
      shortBio: 'Spanish painter and sculptor who co-founded Cubism and became one of the most influential artists of the 20th century.'
    },
    {
      id: 'kahlo',
      name: 'Frida Kahlo',
      media: 'Painting',
      photo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
      bio: 'Frida Kahlo (1907\u20131954) was a Mexican painter known for her vivid, deeply personal self-portraits and works inspired by the nature and artifacts of Mexico. She drew on elements of folk art, surrealism, and realism to explore questions of identity, the human body, and death. A catastrophic bus accident in her youth left her with lifelong pain, which became a recurring subject in her art. Kahlo\'s bold use of color and symbolic imagery has made her an enduring icon of resilience and creative expression.',
      shortBio: 'Mexican painter celebrated for her vivid self-portraits and works inspired by nature, identity, and personal resilience.'
    },
    {
      id: 'monet',
      name: 'Claude Monet',
      media: 'Painting',
      photo: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=400&fit=crop',
      bio: 'Oscar-Claude Monet (1840\u20131926) was a French painter and founder of the Impressionist movement. His approach to capturing the transient effects of light and atmosphere on the landscape revolutionized the art world and laid the groundwork for modern painting. Monet\'s dedication to painting outdoors, or en plein air, led him to create extensive series of the same subject under different conditions, including his iconic Water Lilies, Haystacks, and Rouen Cathedral sequences. His garden at Giverny became both his sanctuary and his most enduring subject.',
      shortBio: 'French Impressionist painter renowned for capturing the fleeting effects of light across landscapes and water.'
    },
    {
      id: 'vangogh',
      name: 'Vincent van Gogh',
      media: 'Painting',
      photo: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
      bio: 'Vincent Willem van Gogh (1853\u20131890) was a Dutch Post-Impressionist painter whose bold colors, expressive brushwork, and emotional honesty profoundly influenced 20th-century art. Despite producing nearly 2,100 artworks in just over a decade, he achieved little commercial success during his lifetime. His paintings\u2014ranging from sun-drenched landscapes of Provence to turbulent night skies\u2014convey an intense psychological depth that continues to captivate audiences worldwide. Works such as The Starry Night and Sunflowers are among the most recognized and reproduced images in art history.',
      shortBio: 'Dutch Post-Impressionist painter whose bold, emotive brushwork and vivid color profoundly shaped modern art.'
    },
    {
      id: 'davinci',
      name: 'Leonardo da Vinci',
      media: 'Painting & Sketching',
      photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
      bio: 'Leonardo di ser Piero da Vinci (1452\u20131519) was an Italian polymath of the High Renaissance whose interests spanned painting, sculpture, architecture, science, music, mathematics, and engineering. Often described as the archetype of the Renaissance Man, Leonardo is celebrated for masterpieces such as the Mona Lisa and The Last Supper. His notebooks, filled with meticulous anatomical studies, inventive sketches, and scientific observations, reveal a mind of unparalleled curiosity. Leonardo\'s ability to merge art with science set a standard for creative inquiry that endures to this day.',
      shortBio: 'Italian Renaissance polymath whose paintings, anatomical sketches, and inventive notebooks defined the ideal of the universal genius.'
    },
    {
      id: 'rodin',
      name: 'Auguste Rodin',
      media: 'Sculpture',
      photo: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=400&fit=crop',
      bio: 'Fran\u00e7ois Auguste Ren\u00e9 Rodin (1840\u20131917) was a French sculptor generally considered the founder of modern sculpture. He possessed a unique ability to model complex, turbulent, and deeply human forms in clay, capturing emotion and movement with unprecedented realism. Although his work was controversial during his lifetime for breaking with the idealized traditions of academic sculpture, it earned him recognition as a progenitor of expressiveness in three-dimensional art. Iconic pieces like The Thinker and The Kiss have become universal symbols of contemplation and passion.',
      shortBio: 'French sculptor regarded as the father of modern sculpture, known for powerfully expressive works like The Thinker.'
    },
    {
      id: 'torres',
      name: 'Maya Torres',
      media: 'Painting',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
      bio: 'Maya Torres is an Austin-based painter known for her vibrant abstract landscapes. Drawing inspiration from the Texas hill country and her Mexican-American heritage, her canvases burst with saturated color and bold, sweeping forms. Torres studied fine art at the University of Texas and has exhibited in galleries across the Southwest. Her work invites viewers to see familiar terrain through a lens of emotion and memory.',
      shortBio: 'Austin-based artist known for vibrant abstract landscapes'
    },
    {
      id: 'whitfield',
      name: 'James Whitfield',
      media: 'Sculpture',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'James Whitfield is a mixed-media sculptor who transforms found objects into striking assemblages that explore themes of memory and impermanence. Working from his Brooklyn studio, Whitfield salvages discarded materials \u2014 rusted metal, reclaimed wood, vintage hardware \u2014 and gives them new life as contemplative sculptural forms. His work has been featured in group shows across the East Coast and is held in several private collections.',
      shortBio: 'Mixed-media sculptor working with found-object assemblages'
    },
    {
      id: 'chen',
      name: 'Sofia Chen',
      media: 'Sketching',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
      bio: 'Sofia Chen is an architectural artist whose meticulous ink and charcoal studies capture the soul of urban spaces. Trained as an architect before turning to fine art full time, Chen brings technical precision and an eye for structural beauty to every piece. Her drawings range from intimate studies of doorways and staircases to sweeping panoramas of city skylines, all rendered with extraordinary detail and a quiet sense of atmosphere.',
      shortBio: 'Architectural ink and charcoal studies of urban spaces'
    },
    {
      id: 'grant',
      name: 'Elijah Grant',
      media: 'Painting & Sketching',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Elijah Grant is a figurative artist whose portraits and gesture sketches capture the energy and emotion of his subjects with remarkable immediacy. Based in Chicago, Grant works in both oil paint and charcoal, moving fluidly between the two media. His painted portraits are rich and luminous, while his charcoal sketches are loose and expressive, often completed in a single sitting. Grant draws from the traditions of classical portraiture while bringing a distinctly contemporary perspective.',
      shortBio: 'Figurative portraits and gesture sketches'
    }
  ];

  /* ---- Artworks ---- */
  var artworks = [
    {
      id: 'starry-night',
      title: 'The Starry Night',
      artistId: 'vangogh',
      category: 'painting',
      year: '1889',
      decade: '1880s',
      medium: 'Oil on canvas',
      dimensions: '73.7 cm \u00d7 92.1 cm (29 in \u00d7 36\u00bc in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/600px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      description: 'The Starry Night depicts a swirling night sky over a village, painted from memory and imagination during van Gogh\'s stay at the Saint-Paul-de-Mausole asylum in Saint-R\u00e9my-de-Provence. The luminous stars and crescent moon blaze with energy, while a towering cypress tree anchors the foreground. It is one of the most recognized paintings in Western art.',
      sold: false,
      featured: false
    },
    {
      id: 'water-lilies',
      title: 'Water Lilies',
      artistId: 'monet',
      category: 'painting',
      year: '1906',
      decade: '1900s',
      medium: 'Oil on canvas',
      dimensions: '89.9 cm \u00d7 94.1 cm (35.4 in \u00d7 37 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/600px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
      description: 'Water Lilies is part of an expansive series of approximately 250 oil paintings that Monet produced during the last thirty years of his life. The works depict the flower garden at his home in Giverny, focusing on the interplay of light, water, and reflection. This particular canvas captures the serene surface of the lily pond in soft, shimmering hues.',
      sold: false,
      featured: false
    },
    {
      id: 'the-thinker',
      title: 'The Thinker',
      artistId: 'rodin',
      category: 'sculpture',
      year: '1904',
      decade: '1900s',
      medium: 'Bronze',
      dimensions: '189 cm \u00d7 98 cm \u00d7 140 cm (74 in \u00d7 39 in \u00d7 55 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Mus%C3%A9e_Rodin_1.jpg/600px-Mus%C3%A9e_Rodin_1.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Mus%C3%A9e_Rodin_1.jpg/1280px-Mus%C3%A9e_Rodin_1.jpg',
      description: 'The Thinker is a bronze sculpture depicting a nude male figure seated on a rock, resting his chin on one hand in deep contemplation. Originally conceived as part of Rodin\'s monumental Gates of Hell, the figure came to represent intellectual activity and philosophical thought. It has become one of the most widely recognized sculptures in the world.',
      sold: false,
      featured: false
    },
    {
      id: 'self-portrait-thorn',
      title: 'Self-Portrait with Thorn Necklace and Hummingbird',
      artistId: 'kahlo',
      category: 'painting',
      year: '1940',
      decade: '1940s',
      medium: 'Oil on canvas',
      dimensions: '61.25 cm \u00d7 47 cm (24.1 in \u00d7 18.5 in)',
      image: 'https://upload.wikimedia.org/wikipedia/en/1/1e/Frida_Kahlo_%28self_portrait%29.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/en/1/1e/Frida_Kahlo_%28self_portrait%29.jpg',
      description: 'In this iconic self-portrait, Kahlo wears a necklace of thorns that pierces her skin, with a dead hummingbird hanging as a pendant. A black cat and a monkey sit on her shoulders amid lush tropical foliage. The painting is rich with personal and cultural symbolism, reflecting themes of pain, hope, and Mexican folk tradition.',
      sold: false,
      featured: false
    },
    {
      id: 'vitruvian-man',
      title: 'Vitruvian Man',
      artistId: 'davinci',
      category: 'sketch',
      year: 'c. 1490',
      decade: '1490s',
      medium: 'Pen and ink on paper',
      dimensions: '34.6 cm \u00d7 25.5 cm (13.6 in \u00d7 10 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/600px-Da_Vinci_Vitruve_Luc_Viatour.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/1280px-Da_Vinci_Vitruve_Luc_Viatour.jpg',
      description: 'Vitruvian Man is a drawing by Leonardo da Vinci that illustrates the ideal human proportions described by the ancient Roman architect Vitruvius. The figure is depicted in two superimposed positions with arms and legs apart, inscribed within both a circle and a square. It stands as an enduring symbol of the harmony between art and science.',
      sold: false,
      featured: false
    },
    {
      id: 'les-demoiselles',
      title: 'Les Demoiselles d\'Avignon',
      artistId: 'picasso',
      category: 'painting',
      year: '1907',
      decade: '1900s',
      medium: 'Oil on canvas',
      dimensions: '243.9 cm \u00d7 233.7 cm (96 in \u00d7 92 in)',
      image: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg',
      description: 'Les Demoiselles d\'Avignon portrays five nude female figures composed of flat, fragmented planes in a radical departure from traditional perspective. The angular forms and mask-like faces reflect the influence of African art and Iberian sculpture on Picasso\'s vision. Widely considered a proto-Cubist masterpiece, the painting shocked the art world and helped launch a new era of modern art.',
      sold: false,
      featured: false
    },
    {
      id: 'guernica',
      title: 'Guernica',
      artistId: 'picasso',
      category: 'painting',
      year: '1937',
      decade: '1930s',
      medium: 'Oil on canvas',
      dimensions: '349.3 cm \u00d7 776.6 cm (137.4 in \u00d7 305.5 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Mural_del_%22Guernica%22_de_Picasso.jpg/600px-Mural_del_%22Guernica%22_de_Picasso.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Mural_del_%22Guernica%22_de_Picasso.jpg/1280px-Mural_del_%22Guernica%22_de_Picasso.jpg',
      description: 'Guernica is a monumental anti-war painting created in response to the bombing of the Basque town of Guernica during the Spanish Civil War. Rendered in stark shades of grey, black, and white, it depicts the suffering of people and animals torn apart by violence. The painting has become a universal and powerful symbol of the devastation wrought by war.',
      sold: false,
      featured: false
    },
    {
      id: 'impression-sunrise',
      title: 'Impression, Sunrise',
      artistId: 'monet',
      category: 'painting',
      year: '1872',
      decade: '1870s',
      medium: 'Oil on canvas',
      dimensions: '48 cm \u00d7 63 cm (19 in \u00d7 25 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/600px-Monet_-_Impression%2C_Sunrise.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg',
      description: 'Impression, Sunrise depicts the port of Le Havre at dawn, with hazy ships and industrial cranes dissolving into soft blue-grey mist beneath a vivid orange sun. The painting\'s title inspired critic Louis Leroy to coin the term "Impressionism," giving a name to the movement. Its loose, rapid brushstrokes capture a fleeting moment of light with remarkable immediacy.',
      sold: false,
      featured: false
    },
    {
      id: 'the-kiss-rodin',
      title: 'The Kiss',
      artistId: 'rodin',
      category: 'sculpture',
      year: '1882',
      decade: '1880s',
      medium: 'Marble',
      dimensions: '181.5 cm \u00d7 112.5 cm \u00d7 117 cm (71.5 in \u00d7 44.3 in \u00d7 46 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Rodin_-_Le_Baiser_06.jpg/600px-Rodin_-_Le_Baiser_06.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Rodin_-_Le_Baiser_06.jpg/1280px-Rodin_-_Le_Baiser_06.jpg',
      description: 'The Kiss depicts the 13th-century Italian lovers Paolo and Francesca, whose story is told in Dante\'s Inferno, at the moment their lips are about to meet. Originally part of The Gates of Hell, Rodin later created it as an independent work in marble. The sculpture\'s smooth, luminous surface and tender embrace have made it an enduring symbol of romantic love.',
      sold: false,
      featured: false
    },
    {
      id: 'anatomy-studies',
      title: 'Anatomy Studies',
      artistId: 'davinci',
      category: 'sketch',
      year: 'c. 1510',
      decade: '1510s',
      medium: 'Pen and ink on paper',
      dimensions: '29.2 cm \u00d7 19.8 cm (11.5 in \u00d7 7.8 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Leonardo_da_Vinci_-_Superficial_anatomy_of_the_shoulder_and_neck_%28recto%29_-_Google_Art_Project.jpg/600px-Leonardo_da_Vinci_-_Superficial_anatomy_of_the_shoulder_and_neck_%28recto%29_-_Google_Art_Project.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Leonardo_da_Vinci_-_Superficial_anatomy_of_the_shoulder_and_neck_%28recto%29_-_Google_Art_Project.jpg/1280px-Leonardo_da_Vinci_-_Superficial_anatomy_of_the_shoulder_and_neck_%28recto%29_-_Google_Art_Project.jpg',
      description: 'Leonardo\'s anatomical studies are a series of detailed drawings produced from direct observation of human dissections. They reveal his extraordinary ability to render muscles, bones, and organs with scientific precision and artistic beauty. These pages from his notebooks anticipated modern anatomical illustration by centuries.',
      sold: false,
      featured: false
    },
    {
      id: 'the-two-fridas',
      title: 'The Two Fridas',
      artistId: 'kahlo',
      category: 'painting',
      year: '1939',
      decade: '1930s',
      medium: 'Oil on canvas',
      dimensions: '173.5 cm \u00d7 173 cm (68.3 in \u00d7 68 in)',
      image: 'https://upload.wikimedia.org/wikipedia/en/f/f9/The_Two_Fridas.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/en/f/f9/The_Two_Fridas.jpg',
      description: 'The Two Fridas is a large double self-portrait showing two versions of the artist seated side by side, their hearts exposed and connected by a single vein. One Frida wears a European Victorian dress while the other wears traditional Tehuana clothing, reflecting her dual cultural heritage. Painted shortly after her divorce from Diego Rivera, the work explores themes of identity, heartbreak, and self-reliance.',
      sold: false,
      featured: false
    },
    {
      id: 'sunflowers',
      title: 'Sunflowers',
      artistId: 'vangogh',
      category: 'painting',
      year: '1888',
      decade: '1880s',
      medium: 'Oil on canvas',
      dimensions: '92.1 cm \u00d7 73 cm (36.2 in \u00d7 28.7 in)',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/600px-Vincent_Willem_van_Gogh_127.jpg',
      imageLg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/1280px-Vincent_Willem_van_Gogh_127.jpg',
      description: 'Sunflowers is one of a series of still-life paintings that van Gogh created in Arles to decorate the room of his friend Paul Gauguin. The vibrant yellows and thick impasto brushstrokes bring an almost sculptural quality to the bouquet. The series has come to symbolize gratitude and the warmth of friendship, and it ranks among the most famous still lifes ever painted.',
      sold: false,
      featured: false
    },
    {
      id: 'desert-bloom',
      title: 'Desert Bloom',
      artistId: 'torres',
      category: 'painting',
      year: '2024',
      decade: '2020s',
      medium: 'Acrylic on canvas',
      dimensions: '91.4 x 121.9 cm',
      description: 'A vivid abstract landscape inspired by the wildflower season in the Texas hill country. Layers of magenta, gold, and turquoise create a sense of depth and movement across the canvas.',
      image: 'https://images.unsplash.com/photo-1744404669053-276d255255c4?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1744404669053-276d255255c4?w=1200&h=900&fit=crop',
      sold: false,
      featured: true
    },
    {
      id: 'amber-horizon',
      title: 'Amber Horizon',
      artistId: 'torres',
      category: 'painting',
      year: '2023',
      decade: '2020s',
      medium: 'Oil on canvas',
      dimensions: '76.2 x 101.6 cm',
      description: 'Warm amber and ochre tones stretch across a panoramic landscape, capturing the golden hour light of a Southwest sunset. Torres uses thick impasto strokes to build texture and luminosity.',
      image: 'https://images.unsplash.com/photo-1763535295646-c7f4de05b3e3?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1763535295646-c7f4de05b3e3?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    },
    {
      id: 'reclaimed-tower',
      title: 'Reclaimed Tower',
      artistId: 'whitfield',
      category: 'sculpture',
      year: '2024',
      decade: '2020s',
      medium: 'Found metal, reclaimed wood, steel wire',
      dimensions: '48.3 x 22.9 x 22.9 cm',
      description: 'A vertical assemblage of salvaged industrial parts \u2014 gears, brackets, and weathered wood fragments \u2014 stacked into a precarious tower that speaks to resilience and reinvention.',
      image: 'images/reclaimed-tower.jpg',
      imageLg: 'images/reclaimed-tower.jpg',
      sold: false,
      featured: false
    },
    {
      id: 'vessel-of-memory',
      title: 'Vessel of Memory',
      artistId: 'whitfield',
      category: 'sculpture',
      year: '2023',
      decade: '2020s',
      medium: 'Rusted steel, vintage glass, copper wire',
      dimensions: '35.6 x 30.5 x 30.5 cm',
      description: 'A hollow spherical form woven from rusted steel strips and fragments of vintage glass. Light passes through the openings, casting intricate shadow patterns that shift throughout the day.',
      image: 'https://images.unsplash.com/photo-1654783912259-659d94fff000?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1654783912259-659d94fff000?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    },
    {
      id: 'bridge-and-fog',
      title: 'Bridge and Fog',
      artistId: 'chen',
      category: 'sketch',
      year: '2024',
      decade: '2020s',
      medium: 'Ink on paper',
      dimensions: '45.7 x 61.0 cm',
      description: 'A detailed ink study of a suspension bridge emerging from morning fog. Chen captures the interplay of engineered precision and natural atmosphere with controlled, confident linework.',
      image: 'https://images.unsplash.com/photo-1516438661688-b47110c6c48d?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1516438661688-b47110c6c48d?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    },
    {
      id: 'stairwell-light',
      title: 'Stairwell Light',
      artistId: 'chen',
      category: 'sketch',
      year: '2023',
      decade: '2020s',
      medium: 'Charcoal on paper',
      dimensions: '50.8 x 40.6 cm',
      description: 'A charcoal rendering of a spiral staircase bathed in diffused light from a skylight above. The drawing balances architectural rigidity with soft tonal gradations that evoke quiet contemplation.',
      image: 'https://images.unsplash.com/photo-1705781023728-f37b275faaf4?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1705781023728-f37b275faaf4?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    },
    {
      id: 'portrait-in-gold',
      title: 'Portrait in Gold',
      artistId: 'grant',
      category: 'painting',
      year: '2024',
      decade: '2020s',
      medium: 'Oil on linen',
      dimensions: '61.0 x 45.7 cm',
      description: 'A luminous portrait rendered in warm golds and deep browns. The subject gazes directly at the viewer with quiet intensity, their features emerging from a loosely painted background of amber light.',
      image: 'https://images.unsplash.com/photo-1694726556009-25b23a2faff1?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1694726556009-25b23a2faff1?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    },
    {
      id: 'gesture-study-iv',
      title: 'Gesture Study IV',
      artistId: 'grant',
      category: 'sketch',
      year: '2024',
      decade: '2020s',
      medium: 'Charcoal on newsprint',
      dimensions: '45.7 x 61.0 cm',
      description: 'One of a series of rapid gesture drawings capturing a figure in motion. Bold, confident charcoal strokes define the essential movement and weight of the pose in just minutes.',
      image: 'https://images.unsplash.com/photo-1744126035996-2ceba8a1cc0a?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1744126035996-2ceba8a1cc0a?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    },
    {
      id: 'evening-figure',
      title: 'Evening Figure',
      artistId: 'grant',
      category: 'painting',
      year: '2023',
      decade: '2020s',
      medium: 'Oil on canvas',
      dimensions: '91.4 x 61.0 cm',
      description: 'A full-length figure stands silhouetted against a dusky evening sky. The painting balances realism in the figure with impressionistic handling of the background, creating a mood of solitude and reflection.',
      image: 'https://images.unsplash.com/photo-1627581370844-ece8a097b9eb?w=600&h=450&fit=crop',
      imageLg: 'https://images.unsplash.com/photo-1627581370844-ece8a097b9eb?w=1200&h=900&fit=crop',
      sold: false,
      featured: false
    }
  ];

  /* ---- Exhibitions ---- */
  var exhibitions = [
    {
      id: 'spring-showcase-2026',
      title: 'Spring Showcase 2026',
      startDate: '2026-04-06',
      endDate: '2026-04-08',
      description: 'A vibrant opening exhibition featuring bold new work from our contemporary artists alongside select masterpieces from the permanent collection. Join us for an evening of art, conversation, and community.',
      artworkIds: ['desert-bloom', 'amber-horizon', 'reclaimed-tower', 'portrait-in-gold'],
      artistIds: ['torres', 'whitfield', 'grant'],
      disclaimer: 'Dates and featured artwork are subject to change. Please contact the gallery to confirm details.'
    },
    {
      id: 'urban-perspectives',
      title: 'Urban Perspectives',
      startDate: '2026-05-15',
      endDate: '2026-05-18',
      description: 'An intimate exhibition exploring the relationship between architecture, light, and the human experience of city spaces. Featuring detailed ink and charcoal studies alongside sculptural interpretations of urban forms.',
      artworkIds: ['bridge-and-fog', 'stairwell-light', 'vessel-of-memory'],
      artistIds: ['chen', 'whitfield'],
      disclaimer: 'Dates and featured artwork are subject to change. Please contact the gallery to confirm details.'
    },
    {
      id: 'impressions-and-expression',
      title: 'Impressions & Expression',
      startDate: '2026-06-10',
      endDate: '2026-06-14',
      description: 'A curated survey tracing the emotional thread from Impressionism through Post-Impressionism to contemporary figurative work. See how artists across centuries have captured feeling through color, light, and form.',
      artworkIds: ['impression-sunrise', 'water-lilies', 'starry-night', 'evening-figure', 'gesture-study-iv'],
      artistIds: ['monet', 'vangogh', 'grant'],
      disclaimer: 'Dates and featured artwork are subject to change. Please contact the gallery to confirm details.'
    }
  ];

  /* ---- Helper Functions ---- */

  function getArtist(id) {
    for (var i = 0; i < artists.length; i++) {
      if (artists[i].id === id) {
        return artists[i];
      }
    }
    return null;
  }

  function getArtwork(id) {
    for (var i = 0; i < artworks.length; i++) {
      if (artworks[i].id === id) {
        return artworks[i];
      }
    }
    return null;
  }

  function getArtworksByArtist(artistId) {
    var results = [];
    for (var i = 0; i < artworks.length; i++) {
      if (artworks[i].artistId === artistId) {
        results.push(artworks[i]);
      }
    }
    return results;
  }

  function getArtworksByCategory(category) {
    if (category === 'all') {
      return artworks.slice();
    }
    var results = [];
    for (var i = 0; i < artworks.length; i++) {
      if (artworks[i].category === category) {
        results.push(artworks[i]);
      }
    }
    return results;
  }

  function searchArtworks(query) {
    var q = query.toLowerCase();
    var results = [];
    for (var i = 0; i < artworks.length; i++) {
      var artwork = artworks[i];
      var artist = getArtist(artwork.artistId);
      var artistName = artist ? artist.name.toLowerCase() : '';
      if (
        artwork.title.toLowerCase().indexOf(q) !== -1 ||
        artistName.indexOf(q) !== -1 ||
        artwork.category.toLowerCase().indexOf(q) !== -1
      ) {
        results.push(artwork);
      }
    }
    return results;
  }

  function getArtistList() {
    return artists
      .map(function(a) { return { id: a.id, name: a.name }; })
      .sort(function(a, b) { return a.name.localeCompare(b.name); });
  }

  function getFeaturedArtwork() {
    for (var i = 0; i < artworks.length; i++) {
      if (artworks[i].featured) {
        return artworks[i];
      }
    }
    return artworks[0];
  }

  function getDecades() {
    var seen = {};
    var result = [];
    for (var i = 0; i < artworks.length; i++) {
      var d = artworks[i].decade;
      if (d && !seen[d]) {
        seen[d] = true;
        result.push(d);
      }
    }
    return result.sort();
  }

  function getExhibitions() {
    return exhibitions.slice();
  }

  function getExhibition(id) {
    for (var i = 0; i < exhibitions.length; i++) {
      if (exhibitions[i].id === id) {
        return exhibitions[i];
      }
    }
    return null;
  }

  function getExhibitionsByArtwork(artworkId) {
    var results = [];
    for (var i = 0; i < exhibitions.length; i++) {
      if (exhibitions[i].artworkIds.indexOf(artworkId) !== -1) {
        results.push(exhibitions[i]);
      }
    }
    return results;
  }

  function getExhibitionsByArtist(artistId) {
    var results = [];
    for (var i = 0; i < exhibitions.length; i++) {
      if (exhibitions[i].artistIds.indexOf(artistId) !== -1) {
        results.push(exhibitions[i]);
      }
    }
    return results;
  }

  /* ---- Public API ---- */
  return {
    artists: artists,
    artworks: artworks,
    exhibitions: exhibitions,
    getArtist: getArtist,
    getArtwork: getArtwork,
    getArtworksByArtist: getArtworksByArtist,
    getArtworksByCategory: getArtworksByCategory,
    searchArtworks: searchArtworks,
    getArtistList: getArtistList,
    getFeaturedArtwork: getFeaturedArtwork,
    getDecades: getDecades,
    getExhibitions: getExhibitions,
    getExhibition: getExhibition,
    getExhibitionsByArtwork: getExhibitionsByArtwork,
    getExhibitionsByArtist: getExhibitionsByArtist
  };

})();
