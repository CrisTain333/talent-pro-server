const IndustryOptions = [
    'AEROSPACE_AND_DEFENSE',
    'AGRICULTURE',
    'ARCHITECTURE_AND_DESIGN',
    'ART_AND_CULTURE',
    'AUTOMOTIVE',
    'BIOTECHNOLOGY',
    'CONSULTING',
    'CONSUMER_ELECTRONICS',
    'E_COMMERCE',
    'EDUCATION',
    'ENERGY_AND_UTILITIES',
    'ENTERTAINMENT_AND_MEDIA',
    'ENVIRONMENTAL_SERVICES',
    'FASHION_AND_APPAREL',
    'FINANCIAL_SERVICES',
    'FOOD_AND_BEVERAGE',
    'GOVERNMENT_AND_PUBLIC_ADMINISTRATION',
    'HOSPITALITY_AND_TOURISM',
    'INFORMATION_TECHNOLOGY',
    'INSURANCE',
    'LEGAL_AND_PROFESSIONAL_SERVICES',
    'MANUFACTURING',
    'MINING_AND_METALS',
    'NONPROFIT_AND_SOCIAL_SERVICES',
    'REAL_ESTATE_AND_CONSTRUCTION',
    'Retail',
    'RETAIL',
    'SPORTS_AND_FITNESS',
    'TELECOMMUNICATIONS',
    'TRANSPORTATION_AND_LOGISTICS'
];
const EmployStatus = ['EMPLOYED', 'INTERNSHIP', 'UNEMPLOYED'];
const EmploymentType = ['FULL_TIME', 'PART_TIME', 'INTERN'];

const LocationType = ['ONSITE', 'HYBRID', 'REMOTE'];

const ExperienceLevel = ['ENTRY', 'MID', 'SENIOR'];

const WeekDay = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
];

const jobSearchableFields = [
    'job_title',
    'address',
    'organization.company_name'
];

const jobFilterableFields = [
    'search',
    'status',
    'job_type',
    'location_type',
    'experience_level'
];

const JobStatus = ['PUBLISHED', 'UNPUBLISHED', 'ON_HOLD', 'CLOSED'];

const allowedFieldsToUpdateJob = [
    'job_title',
    'job_description',
    'industry',
    'job_type',
    'experience_level',
    'required_skills',
    'years_of_experience',
    'location_type',
    'address',
    'start_day',
    'end_day',
    'start_time',
    'end_time',
    'deadline',
    'num_of_vacancy',
    'salary',
    'is_negotiable',
    'status'
];

const applicationStatus = [
    'application_received',
    'application_in_review',
    'shortlisted_for_interview',
    'interview_scheduled',
    'interview_completed',
    'hired',
    'interview_rescheduled',
    'interview_canceled',
    'not_selected'
];

const appliedJobSearchAbleField = ['job.job_title'];
const appliedJobFilterableField = ['status', 'search'];

module.exports = {
    EmployStatus,
    EmploymentType,
    IndustryOptions,
    LocationType,
    ExperienceLevel,
    WeekDay,
    jobSearchableFields,
    jobFilterableFields,
    JobStatus,
    allowedFieldsToUpdateJob,
    applicationStatus,
    appliedJobSearchAbleField,
    appliedJobFilterableField
};
