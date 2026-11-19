import { connectDB } from "@/lib/db";
import CareerRepository from "@/repositories/career.repository";
import type { ISeo } from "@/types/seo.types";
import { EMPLOYMENT_TYPE, Workplace } from "@/enums";
import { isEnumValue } from "@/utils/enum.utils";

export type PublicCareerListing = {
  title: string;
  slug: string;
  department: string;
  employmentType: string;
  workplace: string;
  location: string;
  experience: string;
  description: string;
  openings: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicCareerDetail = PublicCareerListing & {
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  expiresAt?: Date | null;
  seo: Pick<ISeo, "metaTitle" | "metaDescription" | "ogTitle" | "ogDescription">;
};

function hasSupportedCareerOptions(career: { employmentType: string; workplace: string }) {
  return (
    isEnumValue(EMPLOYMENT_TYPE, career.employmentType) &&
    isEnumValue(Workplace, career.workplace)
  );
}

class CareerService {
  async getPublicCareers(options: { limit?: number } = {}) {
    await connectDB();

    const settings = await CareerRepository.getPublicSettings();
    if (settings?.features?.careersEnabled === false) return [];

    const careers = await CareerRepository.findOpenCareers(options.limit);
    return careers.filter(hasSupportedCareerOptions).map((career): PublicCareerListing => ({
      title: career.title,
      slug: career.slug,
      department: career.department,
      employmentType: career.employmentType,
      workplace: career.workplace,
      location: career.location,
      experience: career.experience,
      description: career.description,
      openings: career.openings,
      createdAt: career.createdAt,
      updatedAt: career.updatedAt,
    }));
  }

  async getPublicCareer(slug: string) {
    await connectDB();

    const settings = await CareerRepository.getPublicSettings();
    if (settings?.features?.careersEnabled === false) return null;

    const career = await CareerRepository.findOpenCareerBySlug(slug);
    if (!career || !hasSupportedCareerOptions(career)) return null;

    return {
      title: career.title,
      slug: career.slug,
      department: career.department,
      employmentType: career.employmentType,
      workplace: career.workplace,
      location: career.location,
      experience: career.experience,
      description: career.description,
      openings: career.openings,
      createdAt: career.createdAt,
      updatedAt: career.updatedAt,
      responsibilities: career.responsibilities,
      requirements: career.requirements,
      benefits: career.benefits,
      skills: career.skills,
      expiresAt: career.expiresAt,
      seo: {
        metaTitle: career.seo.metaTitle,
        metaDescription: career.seo.metaDescription,
        ogTitle: career.seo.ogTitle,
        ogDescription: career.seo.ogDescription,
      },
    } satisfies PublicCareerDetail;
  }
}

const careerService = new CareerService();

export default careerService;
