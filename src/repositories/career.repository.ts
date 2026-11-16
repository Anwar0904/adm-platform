import { Career, getOpenCareerFilter } from "@/models/career.model";
import { Settings } from "@/models/settings.model";

const PUBLIC_LIST_FIELDS = [
  "title",
  "slug",
  "department",
  "employmentType",
  "workplace",
  "location",
  "experience",
  "description",
  "openings",
  "createdAt",
  "updatedAt",
].join(" ");

const PUBLIC_DETAIL_FIELDS = [
  PUBLIC_LIST_FIELDS,
  "responsibilities",
  "requirements",
  "benefits",
  "skills",
  "expiresAt",
  "seo.metaTitle",
  "seo.metaDescription",
  "seo.ogTitle",
  "seo.ogDescription",
].join(" ");

class CareerRepository {
  async getPublicSettings() {
    return Settings.findOne({ isDeleted: false })
      .select("features.careersEnabled")
      .lean();
  }

  async findOpenCareers() {
    return Career.find(getOpenCareerFilter())
      .select(PUBLIC_LIST_FIELDS)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
      .lean();
  }

  async findOpenCareerBySlug(slug: string) {
    return Career.findOne({ slug, ...getOpenCareerFilter() })
      .select(PUBLIC_DETAIL_FIELDS)
      .lean();
  }
}

const careerRepository = new CareerRepository();

export default careerRepository;
