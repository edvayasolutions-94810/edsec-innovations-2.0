import { MessageCircle, Phone } from 'lucide-react';

const FloatingContact = () => {
    const phoneNumber = '918660132700'; // Format: country code + number without +
    const message = 'Hi! I would like to know more about your courses.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    const callUrl = `tel:+${phoneNumber}`;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Call Button */}
            <a
                href={callUrl}
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white rounded-full p-4 hover-lift glow-button shadow-[0_0_20px_rgba(20,184,166,0.5)] flex items-center justify-center relative overflow-hidden group"
                aria-label="Call Us"
            >
                <Phone className="h-6 w-6 relative z-10" />
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full origin-center"></div>
            </a>

            {/* WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-400 text-white rounded-full p-4 hover-lift glow-button shadow-[0_0_15px_rgba(34,197,94,0.4),0_0_25px_rgba(20,184,166,0.2)] ring-2 ring-[#14B8A6]/30 flex items-center justify-center relative overflow-hidden group transition-all duration-300"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="h-6 w-6 relative z-10" />
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full origin-center"></div>
            </a>
        </div>
    );
};

export default FloatingContact;
