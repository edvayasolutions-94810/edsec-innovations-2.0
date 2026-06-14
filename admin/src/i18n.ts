import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal Proof-of-Concept dictionaries to prevent rewriting the entire DOM.
// We cover the layout navigation and core action buttons for English, Hindi, and Kannada.
const resources = {
    en: {
        translation: {
            "nav": {
                "home": "Home",
                "courses": "Courses",
                "internship": "Internship",
                "about": "About",
                "contact": "Contact us"
            },
            "cta": {
                "enroll": "Enroll Now",
                "apply": "Apply Now",
                "download": "Download Syllabus"
            }
        }
    },
    hi: {
        translation: {
            "nav": {
                "home": "मुख्य पृष्ठ",
                "courses": "पाठ्यक्रम",
                "internship": "इंटर्नशिप",
                "about": "हमारे बारे में",
                "contact": "संपर्क करें"
            },
            "cta": {
                "enroll": "अभी नामांकन करें",
                "apply": "अभी आवेदन दें",
                "download": "पाठ्यक्रम डाउनलोड करें"
            }
        }
    },
    kn: {
        translation: {
            "nav": {
                "home": "ಮುಖಪುಟ",
                "courses": "ಕೋರ್ಸುಗಳು",
                "internship": "ಇಂಟರ್ನ್‌ಶಿಪ್",
                "about": "ನಮ್ಮ ಬಗ್ಗೆ",
                "contact": "ಸಂಪರ್ಕಿಸಿ"
            },
            "cta": {
                "enroll": "ಈಗ ದಾಖಲಾಗು",
                "apply": "ಈಗ ಅನ್ವಯಿಸು",
                "download": "ಪಠ್ಯಕ್ರಮ ಡೌನ್ಲೋಡ್ ಮಾಡಿ"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;
