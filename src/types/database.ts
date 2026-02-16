export type DegreeLevel = 'BACHELOR' | 'MASTER';

export interface School {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
}

export interface Department {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    schoolId: string;
    headOfDepartmentId?: string | null;
    school?: School;
    headOfDepartment?: Faculty;
}

export interface Subject {
    id: string;
    name: string;
    creditUnits: number;
    semester: number;
    code?: string;
    area?: string;
    eligibility?: string;
}

export interface Faculty {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    imageUrl: string | null;
    email: string | null;
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    degreeLevel: DegreeLevel;
    duration: string;
    description: string | null;
    language: string;
    entryRequirements: string | null;
    minimumGrade: string | null;
    careerPaths: string | null;
    tuitionFee?: string | null;
    credits?: number | null;
    sections?: any[] | null;
    imageUrl: string | null;
    schoolId: string;
    departmentId: string | null;
    school?: School;
    department?: Department;
    subjects?: Subject[];
}

export interface News {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    imageUrl: string | null;
    publishDate: string;
}

export interface Event {
    id: string;
    title: string;
    slug: string;
    date: string;
    endDate: string | null;
    location: string | null;
    category: string | null;
    content: string | null;
    imageUrl: string | null;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ResearchProject {
    id: string;
    title: string;
    slug: string;
    leadResearcher: string | null;
    fundingSource: string | null;
    description: string | null;
    content: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// APPLICATION PORTAL TYPES

export type LinkEnum = 'APPLICANT' | 'ADMISSIONS' | 'ADMIN' | 'STUDENT' | 'REGISTRAR' | 'INSTRUCTOR';

export type ApplicationStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'DOCS_REQUIRED'
    | 'ADMITTED'
    | 'REJECTED'
    | 'OFFER_ACCEPTED'
    | 'ADMISSION_LETTER_GENERATED'
    | 'OFFER_DECLINED'
    | 'PAYMENT_SUBMITTED'
    | 'ENROLLED';

export type DocumentType =
    | 'PASSPORT'
    | 'TRANSCRIPT'
    | 'CERTIFICATE'
    | 'CV'
    | 'MOTIVATION_LETTER'
    | 'LANGUAGE_CERT';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export type PaymentStatus = 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Profile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: LinkEnum;
    country_of_residence: string | null;
    date_of_birth?: string | null;
    student_id: string | null;
    created_at: string;
}

export interface Application {
    id: string;
    user_id: string;
    course_id: string | null;
    status: ApplicationStatus;
    submitted_at: string | null;
    personal_info: any | null;     // JSONB
    contact_details: any | null;   // JSONB
    education_history: any | null; // JSONB
    motivation: any | null;        // JSONB
    language_proficiency: any | null; // JSONB
    internal_notes?: string | null;
    application_number: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    user?: Profile;
    course?: Course;
}

export interface ApplicationDocument {
    id: string;
    application_id: string;
    type: DocumentType;
    url: string;
    name: string;
    uploaded_at: string;
}

export interface AdmissionOffer {
    id: string;
    application_id: string;
    tuition_fee: number;
    currency: string;
    payment_deadline: string | null;
    document_url: string | null;
    status: OfferStatus;
    created_at: string;
}

export interface TuitionPayment {
    id: string;
    offer_id: string;
    amount: number;
    status: PaymentStatus;
    transaction_reference: string | null;
    payment_method: string | null;
    created_at: string;
}

export interface Student {
    id: string; // UUID
    user_id: string;
    student_id: string; // "SYK-2024-001"
    application_id: string;
    program_id: string; // course_id
    enrollment_status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'WITHDRAWN';
    institutional_email: string;
    personal_email: string;
    start_date: string;
    expected_graduation_date: string;
    created_at: string;
    updated_at: string;

    // Relations
    user?: Profile;
    program?: Course;
}

export interface AuditLog {
    id: string;
    action: string; // "ENROLLMENT_CONFIRMED", "APPLICATION_LOCKED"
    entity_table: string; // "applications", "students"
    entity_id: string;
    actor_id: string; // system or admin user id
    metadata: any; // JSONB snapshot
    timestamp: string;
}

export interface Semester {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
    created_at: string;
}

export interface Module {
    id: string;
    code: string;
    title: string;
    description: string | null;
    credits: number;
    capacity: number;
    department_id: string | null;
    created_at: string;
}

export interface RegistrationWindow {
    id: string;
    semester_id: string;
    open_at: string;
    close_at: string;
    add_drop_deadline: string;
    status: 'CLOSED' | 'OPEN' | 'ARCHIVED';
    semester?: Semester;
}

export interface ModuleEnrollment {
    id: string;
    student_id: string;
    module_id: string;
    semester_id: string;
    status: 'REGISTERED' | 'DROPPED' | 'COMPLETED' | 'FAILED';
    grade: number | null;
    grade_status: 'PROVISIONAL' | 'FINAL';
    finalized_by: string | null;
    finalized_at: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    module?: Module;
    student?: Student;
    semester?: Semester;
}

export interface ClassSession {
    id: string;
    module_id: string;
    semester_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    location_type: 'CAMPUS' | 'ONLINE';
    location_detail: string | null;

    // Relations
    module?: Module;
}
// =============================================
// HOUSING MODULE TYPES
// =============================================

export interface HousingBuilding {
    id: string;
    name: string;
    campus_location: string;
    total_rooms: number;
    created_at: string;
    updated_at: string;
}

export interface HousingRoom {
    id: string;
    building_id: string;
    room_number: string;
    capacity: number;
    monthly_rate: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    amenities: string[];
    created_at: string;
    updated_at: string;
    building?: HousingBuilding;
}

export interface HousingApplication {
    id: string;
    student_id: string;
    semester_id: string;
    preferred_building_id: string | null;
    move_in_date: string;
    move_out_date: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLIST';
    priority_score: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    student?: Student;
    semester?: Semester;
    building?: HousingBuilding;
}

export interface HousingAssignment {
    id: string;
    application_id: string;
    room_id: string;
    student_id: string;
    start_date: string;
    end_date: string;
    checked_in_at: string | null;
    checked_out_at: string | null;
    status: 'ASSIGNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
    updated_at: string;
    application?: HousingApplication;
    room?: HousingRoom;
    student?: Student;
}

export interface HousingDeposit {
    id: string;
    application_id: string;
    student_id: string;
    amount: number;
    payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
    payment_method: string | null;
    transaction_id: string | null;
    paid_at: string | null;
    created_at: string;
}

// =============================================
// IT MATERIALS MODULE TYPES
// =============================================

export type ItAssetType = 'LMS' | 'EMAIL' | 'VPN' | 'VIRTUAL_LAB' | 'LIBRARY' | 'SOFTWARE_LICENSE';

export interface ItAsset {
    id: string;
    asset_type: ItAssetType;
    name: string;
    description: string | null;
    access_url: string | null;
    auto_provision: boolean;
    license_limit: number | null;
    current_usage: number;
    created_at: string;
    updated_at: string;
}

export interface StudentItAccess {
    id: string;
    student_id: string;
    asset_id: string;
    credentials: any; // JSONB for encrypted data
    activated_at: string | null;
    expires_at: string | null;
    deactivated_at: string | null;
    status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'DEACTIVATED';
    created_at: string;
    updated_at: string;
    student?: Student;
    asset?: ItAsset;
}

// =============================================
// HOUSING FINANCE TYPES
// =============================================

export type InvoiceStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED' | 'OVERDUE';
export type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'LOCAL_RAILS' | 'PAYGOWIRE';
export type FinancePaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type InvoiceItemType = 'HOUSING_DEPOSIT' | 'MONTHLY_RENT' | 'UTILITIES' | 'CLEANING_FEE' | 'MEAL_PLAN' | 'LATE_FEE';

export interface HousingInvoice {
    id: string;
    reference_number: string;
    student_id: string;
    application_id?: string | null;
    total_amount: number;
    paid_amount: number;
    currency: string;
    status: InvoiceStatus;
    due_date: string;
    metadata: any; // JSONB
    created_at: string;
    updated_at: string;
    student?: Student;
    items?: HousingInvoiceItem[];
    payments?: HousingPayment[];
}

export interface HousingInvoiceItem {
    id: string;
    invoice_id: string;
    description: string;
    item_type: InvoiceItemType;
    amount: number;
    quantity: number;
    created_at: string;
}

export interface HousingPayment {
    id: string;
    invoice_id: string;
    student_id: string;
    amount: number;
    currency: string;
    status: FinancePaymentStatus;
    payment_method: PaymentMethod;
    paygowire_transaction_id?: string | null;
    paygowire_payment_url?: string | null;
    billing_country?: string | null;
    paid_at?: string | null;
    metadata: any; // JSONB
    created_at: string;
    updated_at: string;
}
