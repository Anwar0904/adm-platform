import type { Metadata } from "next";
import LegalPage, { legalIcons, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how Arazi Digital Media collects, uses, and protects personal information.",
};

const sections: LegalSection[] = [
    {
        id: "information-we-collect",
        title: "Information we collect",
        paragraphs: ["When you contact ADM, request a consultation, use our website, or work with us, we may receive information that helps us respond and deliver our services."],
        bullets: [
            "Contact details such as your name, email address, phone number, company, and project context.",
            "Information you choose to include in forms, messages, files, or consultation requests.",
            "Technical details such as device type, browser, approximate location, and pages visited.",
        ],
    },
    {
        id: "how-we-use-information",
        title: "How we use information",
        paragraphs: ["We use information for clear, practical purposes: to communicate with you, understand your needs, provide proposals and services, improve our website, and keep our systems secure."],
    },
    {
        id: "when-we-share",
        title: "When we share information",
        paragraphs: ["ADM does not sell personal information. We share information only when needed to provide a service, comply with the law, protect our rights, or support a trusted provider working on our behalf. Those providers are expected to protect the information they handle."],
    },
    {
        id: "retention-and-security",
        title: "Retention and security",
        paragraphs: ["We keep information only as long as it is reasonably needed for the purpose it was collected, to meet legal or accounting requirements, or to resolve an active matter. We use appropriate administrative, technical, and organizational safeguards, while recognizing that no online system can promise absolute security."],
    },
    {
        id: "your-choices",
        title: "Your choices",
        paragraphs: ["You can ask us to access, correct, update, or delete personal information we hold about you, subject to applicable requirements. You can also unsubscribe from non-essential communications at any time."],
    },
    {
        id: "contact",
        title: "Contact us",
        paragraphs: ["For privacy questions or requests, email hello@adm.com with the subject \"Privacy request\". We may need to verify your identity before completing a request."],
    },
];

export default function PrivacyPolicyPage() {
    return <LegalPage currentHref="/privacy-policy" eyebrow="Privacy policy" title="Your information, handled with care." summary="We build digital experiences for people. This policy explains what information ADM collects, why we use it, and the choices you have along the way." updated="September 20, 2026" icon={legalIcons.privacy} accent="bg-blue-500/20 text-blue-200" sections={sections} />;
}