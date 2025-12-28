import { useNavigate } from 'react-router-dom';
import logoNavbar from '../../assets/logo_navbar.svg';

export default function Navbar() {
    const navigate = useNavigate();

    const handleEnterTerminal = () => {
        navigate('/chat');
    };

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

        if (window.lenis) {
            // Use Lenis for luxury smooth scroll
            window.lenis.scrollTo(`#${id}`, {
                offset: -100, // Negative value for top offset
                duration: 1.5, // Slower duration for smoother feel
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        } else {
            // Fallback
            const element = document.getElementById(id);
            if (element) {
                const offset = 100;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1400px] mx-auto">
                <div className="flex items-center gap-2">
                    <img src={logoNavbar} alt="NEXORA" className="h-8 md:h-10 w-auto" />
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#directives" onClick={(e) => handleScroll(e, 'directives')} className="text-gray-400 hover:text-white transition-colors duration-200">System Directives</a>
                    <a href="#architecture" onClick={(e) => handleScroll(e, 'architecture')} className="text-gray-400 hover:text-white transition-colors duration-200">Trust Architecture</a>
                    <a href="#code" onClick={(e) => handleScroll(e, 'code')} className="text-gray-400 hover:text-white transition-colors duration-200">CLI</a>
                </div>

                {/* Enter Terminal Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleEnterTerminal}
                        className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-2 text-sm md:px-5 md:py-2 md:text-base rounded-md font-semibold hover:opacity-90 transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] whitespace-nowrap"
                    >
                        Launch Terminal
                    </button>
                </div>
            </div>
        </nav>
    );
}
