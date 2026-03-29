import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Clean up any existing scripts if re-mounting to avoid duplicate widgets
        if (document.getElementById('google-translate-script')) {
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        // Required callback for Google Translate API
        (window as any).googleTranslateElementInit = () => {
            if ((window as any).google && (window as any).google.translate) {
                new (window as any).google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,hi,kn,te,ta,ml,gu,bn,mr,ur', // Indian major languages
                        autoDisplay: false,
                        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
                    },
                    'google_translate_element'
                );
            }
        };

        return () => {
            // we don't remove the script to avoid flickering on React router changes
        };
    }, []);

    return (
        <div className="google-translate-container translate-widget relative overflow-hidden rounded-md border border-[rgba(20,184,166,0.3)] bg-[rgba(255,255,255,0.05)] text-xs h-8 flex items-center px-1 max-w-[160px]">
            <div id="google_translate_element" className="w-full"></div>
            <style>{`
                /* Hide the google translate top bar & styling artifacts */
                .goog-te-banner-frame.skiptranslate { display: none !important; }
                body { top: 0px !important; }
                .goog-te-gadget { font-family: 'Inter', sans-serif !important; color: transparent !important; }
                .goog-te-gadget span { display: none !important; }
                .goog-te-gadget .goog-te-combo { 
                    margin: 0 !important; 
                    padding: 4px 8px !important; 
                    border-radius: 4px;
                    border: none;
                    background: transparent;
                    color: inherit;
                    width: 100%;
                    cursor: pointer;
                    outline: none;
                }
                .goog-te-combo:focus { outline: none !important; }
                #goog-gt-tt { display: none !important; }
                .goog-tooltip { display: none !important; }
                .goog-tooltip:hover { display: none !important; }
            `}</style>
        </div>
    );
};

export default GoogleTranslate;
