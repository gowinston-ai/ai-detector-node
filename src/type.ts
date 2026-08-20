// Global endpoint Error Response
export interface GlobalEndpointErrorResponse {
    status: number;
    error: string;
    description: string;
}

// AI Text Detection
export interface AiTextDetectionRequest {
    text?: string;
    file?: string;
    website?: string;
    version?: string;
    sentences?: boolean;
    language?: string;
}

interface AiTextDetectionSentence {
    text: string;
    score: number;
}

interface AiTextDetectionAttackDetected {
    zero_width_space: boolean;
    homoglyph_attack: boolean;
}

export interface AiTextDetectionResponse {
    status: number;
    score: number;
    sentences: AiTextDetectionSentence[];
    input: string;
    attack_detected: AiTextDetectionAttackDetected;
    readability_score: number;
    credits_used: number;
    credits_remaining: number;
    version: string;
    language: string;
}
// End AI Text Detection

// AI Image Detection
export interface AiImageDetectionRequest {
    url: string;
    version?: string;
}

interface ImageDetectionC2paManifest {
    vendor?: string;
    claim_generator?: string;
    title?: string;
    credentials?: Record<string, unknown>;
    thumbnail?: Record<string, unknown>;
    ingredients?: unknown[];
    ingredient_paths?: string[];
    assertions?: Record<string, unknown>;
    alg?: string;
    ta_url?: string;
    private_key?: string;
    sign_cert?: string;
}

interface ImageDetectionC2pa {
    active_manifest?: ImageDetectionC2paManifest;
    manifests?: Record<string, ImageDetectionC2paManifest>;
}

interface ImageDetectionExif {
    DateCreated?: string;
    Description?: string;
    Headline?: string;
    MaxAvailWidth?: string;
    MaxAvailHeight?: string;
    ImageRating?: string;
    DescriptionWriter?: string;
    Genre?: string;
    RightsUsageTerms?: string;
    SceneCode?: string;
    AdditionalModelInformation?: string;
    Creator?: string;
    CreditLine?: string;
    CopyrightNotice?: string;
    ImageSupplier?: string;
    Locationcreated?: string;
    MinorModelAgeDisclosure?: string;
    WebStatementofRights?: string;
    ModelAge?: string;
    ImageSupplierImageID?: string;
    LinkedEncodedRightsExpression?: string;
    DataMining?: string;
    Artwork?: string;
    ImageRegistryEntry?: string;
    City?: string;
    CodeofOrganisationFeaturedintheImage?: string;
    EventIdentifier?: string;
    EventName?: string;
    Contributor?: string;
    CopyrightOwner?: string;
    Country?: string;
    DigitalSourceType?: string;
    PropertyReleaseId?: string;
    PropertyReleaseStatus?: string;
    NameofOrganisationFeaturedintheImage?: string;
    Source?: string;
    DigitalImageGUID?: string;
    Licensor?: string;
    keywords?: string[];
    ImageCreator?: Record<string, unknown>;
    Instructions?: string;
    Title?: string;
}

interface ImageDetectionMetadataAutoOrient {
    width: number;
    height: number;
}

interface ImageDetectionMetadataBackgroundRgb {
    r: number;
    g: number;
    b: number;
}

interface ImageDetectionMetadataBackgroundGray {
    gray: number;
}

interface ImageDetectionMetadata {
    orientation?: number;
    format: string;
    size?: number;
    width: number;
    height: number;
    autoOrient: ImageDetectionMetadataAutoOrient;
    space: string;
    channels: number;
    depth: string;
    density?: number;
    chromaSubsampling?: string;
    isProgressive: boolean;
    isPalette: boolean;
    bitsPerSample?: number;
    pages?: number;
    pageHeight?: number;
    loop?: number;
    delay?: number[];
    pagePrimary?: number;
    hasProfile: boolean;
    hasAlpha: boolean;
    background?: ImageDetectionMetadataBackgroundRgb | ImageDetectionMetadataBackgroundGray;
    levels?: Record<string, unknown>[];
    subifds?: number;
    resolutionUnit?: string;
    formatMagick?: string;
    comments?: Record<string, unknown>[];
}

export interface AiImageDetectionResponse {
    score: number;
    human_probability: number;
    ai_probability: number;
    version: string;
    mime_type: string;
    c2pa?: ImageDetectionC2pa;
    exif?: ImageDetectionExif;
    metadata: ImageDetectionMetadata;
    ai_watermark_detected: boolean;
    ai_watermark_issuers?: Record<string, unknown>;
    credits_used: number;
    credits_remaining: number;
}
// End AI Image Detection

// Advanced AI Image Detection
export interface AdvancedAiImageDetectionRequest {
    image_url: string;
}

interface AdvancedAiImageDetectionToolAnalysis {
    id: string;
    analysis: string;
    result: Record<string, unknown> | string;
}

export interface AdvancedAiImageDetectionResponse {
    status: number;
    cost: number;
    language: string;
    title: string;
    tags: string[];
    tool_used: string[];
    label: "AI-Generated" | "Human";
    confidence: "High" | "Moderate" | "Low";
    authenticity: "Authentic" | "Manipulated";
    conclusion: string;
    analysis: string;
    tools_used_analysis: AdvancedAiImageDetectionToolAnalysis[];
    balance: number;
}
// End Advanced AI Image Detection

// Plagiarism Detection
export interface PlagiarismRequest {
    text?: string;
    file?: string;
    website?: string;
    excluded_sources?: string[];
    language?: string;
    country?: string;
}

interface PlagiarismScanInformation {
    service: string;
    scanTime: string;
    inputType: string;
    language: string;
}

interface PlagiarismResult {
    score: number;
    sourceCounts: number;
    textWordCounts: number;
    totalPlagiarismWords: number;
    identicalWordCounts: number;
    similarWordCounts: number;
}

interface PlagiarismFoundSequence {
    startIndex: number;
    endIndex: number;
    sequence: string | null;
}

interface PlagiarismSource {
    score: number;
    canAccess: boolean;
    url: string;
    title: string;
    plagiarismWords: number;
    identicalWordCounts: number;
    similarWordCounts: number;
    totalNumberOfWords: number;
    author: string | null;
    description: string | null;
    publishedDate: number | null;
    source: string | null;
    citation: boolean;
    plagiarismFound: PlagiarismFoundSequence[];
    is_excluded: boolean;
}

interface PlagiarismAttackDetected {
    zero_width_space: boolean;
    homoglyph_attack: boolean;
}

interface PlagiarismSimilarWord {
    index: number;
    word: string;
}

export interface PlagiarismResponse {
    status: number;
    scanInformation: PlagiarismScanInformation;
    result: PlagiarismResult;
    sources: PlagiarismSource[];
    attackDetected: PlagiarismAttackDetected;
    text: string;
    similarWords: PlagiarismSimilarWord[];
    citations: string[];
    indexes: PlagiarismFoundSequence[];
    credits_used: number;
    credits_remaining: number;
}
// End Plagiarism Detection

// Fact Check
export interface FactCheckRequest {
    text?: string;
    file?: string;
    website?: string;
    language?: string;
}

interface FactCheckLink {
    url: string;
    title: string;
}

interface FactCheckClaim {
    id: number;
    sentence: string;
    claim: string;
    verdict: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "NOT_ENOUGH_EVIDENCE" | "REFUTED";
    score: number;
    explanation: string;
    links: FactCheckLink[];
}

interface FactCheckSentence {
    id: number;
    text: string;
}

export interface FactCheckResponse {
    status: number;
    claims: FactCheckClaim[];
    score: number;
    claimsCount: number;
    text: string;
    sentences: FactCheckSentence[];
    input: string;
    language: string;
    creditsUsed: number;
    creditsRemaining: number;
    wordCount: number;
}
// End Fact Check

// Text Compare
export interface TextCompareRequest {
    first_text: string;
    second_text: string;
}

interface TextCompareInformation {
    total_word_count: number;
    matching_word_count: number;
    similarity_percentage: number;
    items: TextCompareItem[];
};

interface TextCompareItem {
    type: string;
    word_count: number;
    index_start: number;
    length: number;
};

export interface TextCompareResponse {
    status: number;
    similarity_score: number;
    first_text: TextCompareInformation;
    second_text: TextCompareInformation;
    credits_used: number;
    credits_remaining: number;
}
// End Text Compare