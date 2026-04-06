import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import ManualVideoPlayer from '@/components/ManualVideoPlayer';
import Image from 'next/image';

const VIDEOS = [
  {
    label: 'How to use Semanext®',
    src: 'https://www.lupin.com/uploads/video/SEMANEXT.mp4',
    // Optional: set when a static poster image is available, e.g. '/assets/video-manuals/semanext.jpg'
    poster: null,
  },
  {
    label: 'How to use Livarise®',
    src: 'https://www.lupin.com/uploads/video/LupinsLivarise.mp4',
    poster: null,
  },
];

export async function generateMetadata() {
  return generateSEOMetadata({
    title: 'Welcome to Lupin Patient Support',
    description:
      'Instructions for use: watch how to use Semanext® and Livarise® with these official user manual videos.',
    canonicalUrl: 'https://www.lupin.com/video/how-to-use-semaglutide-pen-injection-video.mp4 ',
    keywords: 'Semanext, Livarise, user manual, instructions for use, Lupin',
  });
}

export default function SemanextHowToUsePage() {
  return (
    <main className="user-manual-videos">
      {/* logo */}
      <div className='user-manual-videos__logo'>
        <Image src="/assets/The_Lupin_Logo.svg" width="80" height="80" />
      </div>
      <div className="container">
        <div className="user-manual-videos__panel">
          <header className="user-manual-videos__header">
            <h1 className="user-manual-videos__title">Welcome to Lupin Patient Support</h1>
            {/* <p className="user-manual-videos__subtitle">Instructions for Use</p> */}
          </header>
          <div className="user-manual-videos__grid">
            {VIDEOS.map((item) => (
              <div key={item.src} className="user-manual-videos__col">
                <span className="user-manual-videos__pill">{item.label}</span>
                <div className="user-manual-videos__player-wrap">
                  <ManualVideoPlayer src={item.src} poster={item.poster} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
