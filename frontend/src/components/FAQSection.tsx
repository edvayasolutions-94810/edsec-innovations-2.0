import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What certifications will I receive after completing the program?',
    answer: 'You will receive an MSME (Micro, Small & Medium Enterprises) certified completion certificate recognized by industry leaders across India. This certificate adds significant value to your resume and career prospects.',
  },
  {
    question: 'What is the structure of the Certified Programs?',
    answer: 'Our programs are comprehensive, progressive multi-level programs that include real-world projects, live mentor guidance, and verified MSME certification, along with career acceleration tracks like Git & Resume.',
  },
  {
    question: 'Do I need prior coding experience to enroll?',
    answer: 'No! Our courses are designed for beginners as well as intermediate learners. We start from the basics and gradually move to advanced concepts. Our mentors provide personalized guidance throughout.',
  },
  {
    question: 'When do new batches start?',
    answer: 'We offer flexible batch timings to accommodate students and working professionals. Contact us for the latest batch schedule.',
  },
  {
    question: 'What kind of projects will I work on?',
    answer: 'You will work on real-world, industry-relevant projects. For example, Generative AI students build production LLM and RAG agents, Full Stack students create complete modern web applications with Next.js and AI capabilities, and Python with AI/ML students build predictive pipelines and deep learning models.',
  },
  {
    question: 'Is there career and placement support included?',
    answer: 'Yes! Our programs include comprehensive job placement support, technical interview preparation, GitHub portfolio curation, and resume building. We also connect students with industry partners for job opportunities.',
  },
  {
    question: 'Can I download the course brochure before enrolling?',
    answer: 'Absolutely! Each course page has a download button for the detailed brochure in PDF format. You can also visit our Courses page to browse and download brochures for all programs.',
  },
  {
    question: 'What are the fees for the courses?',
    answer: 'Course fees vary by program and duration. Please contact us via the Contact page or WhatsApp for detailed fee structure and available discounts for early enrollment.',
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg px-6 border-none shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
