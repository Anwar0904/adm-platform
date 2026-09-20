import type { Metadata } from "next";
import LegalPage, { legalIcons, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "The terms that guide use of the Arazi Digital Media website and services.",
};

const sections: LegalSection[] = [
    {
        id: "using-our-services",
        title: "Using our services",
        paragraphs: ["ADM provides digital strategy, design, engineering, and related services. You agree to provide accurate information, collaborate in good faith, and use our website and services only for lawful purposes."],
    },
    {
        id: "project-engagements",
        title: "Project engagements",
        paragraphs: ["A proposal, statement of work, or other written agreement will define the scope, deliverables, timeline, fees, responsibilities, and acceptance criteria for a project. If a project agreement conflicts with these general terms, the project agreement controls for that engagement."],
    },
    {
        id: "your-materials",
        title: "Your materials and approvals",
        paragraphs: ["You retain ownership of the content, trademarks, data, and materials you provide. You confirm that you have the right to share them with us. You are responsible for timely feedback, approvals, and ensuring that final materials meet your business and legal requirements."],
    },
    {
        id: "our-work",
        title: "Our work and intellectual property",
        paragraphs: ["ADM retains ownership of its pre-existing tools, methods, templates, know-how, and reusable components. Rights in final project deliverables transfer or are licensed as described in the applicable project agreement, typically after agreed payments are complete."],
    },
    {
        id: "third-party-services",
        title: "Third-party services",
        paragraphs: ["Projects may depend on hosting providers, APIs, software libraries, app stores, or other third-party services. Their availability, policies, pricing, and performance are controlled by those providers. We will work responsibly with them, but cannot guarantee their ongoing operation."],
    },
    {
        id: "limits-and-changes",
        title: "Limits and changes",
        paragraphs: ["Our website and general information are provided as available. To the extent permitted by law, ADM is not responsible for indirect or consequential losses arising from use of the website. We may update these terms when our services or legal obligations change and will post the current version here."],
    },
    {
        id: "contact",
        title: "Contact us",
        paragraphs: ["Questions about these terms can be sent to hello@adm.com. We will always try to resolve concerns directly and constructively."],
    },
];

export default function TermsPage() {
    return <LegalPage currentHref="/terms" eyebrow="Terms of service" title="Clear expectations make better work." summary="These terms keep the relationship between ADM and our clients straightforward, respectful, and grounded in the project agreements we make together." updated="September 20, 2026" icon={legalIcons.terms} accent="bg-cyan-500/20 text-cyan-200" sections={sections} />;
}