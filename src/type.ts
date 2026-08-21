// Global endpoint Error Response
export interface GlobalEndpointErrorResponse {
    /** HTTP status code of the error response. */
    status: number;
    /** Error code returned by the API (e.g. BAD_REQUEST, UNAUTHORIZED, PAYMENT_REQUIRED). */
    error: string;
    /** Human-readable description of the error. */
    description: string;
}

// AI Text Detection
export interface AiTextDetectionRequest {
    /** The text to scan. It is required except if you supply a website or a file. Minimum 300 characters. Texts under 600 characters may produce unreliable results and should be avoided. Maximum 150 000 characters per request. */
    text?: string;
    /** A publicly accessible URL to a file to scan. The file must be publicly available online (not a local file path) so our API can access it. The file must be in plain .pdf, .doc or .docx format. The file has priority over the text, so if you give a text and a file, it's the file that will be scanned. */
    file?: string;
    /** A website URL to scan. If you supply a website, the API will fetch the content of the website and scan it. The website must be publicly accessible. It's important to know that the website has priority over the text and the file, so if you give a text, a file and a website, it's the website that will be scanned. */
    website?: string;
    /** The model version to use. Our latest and most accurate version is "4.18". Using "latest" will make sure you are always using the latest version. Options: 4.18, 4.17, 4.16, 4.15, 4.14, 4.13, 4.12, 4.11, 4.10, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 3.1, 3.0, 2.0, latest. Default: 4.18. Note: Version 3.1 is identical to 3.0 but preserves newline characters in the returned sentences, while 3.0 removes them.
    *@default latest
    */
    version?: string;
    /** Whether the response should include an array of sentences and their scores. 
     * @default true
     */
    sentences?: boolean;
    /** 2 letter language code. Default: auto.

    If you put 'auto', the API will automatically detect the language based on the text.

    Supported languages:

    English (en), French (fr), Spanish (es), Portuguese (pt), Dutch (nl), German (de), Polish (pl), Italian (it), Romanian (ro), Indonesian (id), Tagalog (tl), Russian (ru), Bulgarian (bg) and Chinese simplified (zh).
    *@default "auto"
    */
    language?: string;
}

interface AiTextDetectionSentence {
    /** The text field contains the actual text of the sentence that was analyzed. */
    text: string;
    /** The score field within each sentence object indicates the sentiment score assigned to that particular sentence by the AI. */
    score: number;
}

interface AiTextDetectionAttackDetected {
    /** Indicates if the text contains zero-width spaces. */
    zero_width_space: boolean;
    /** Indicates if the text contains homoglyph attacks. */
    homoglyph_attack: boolean;
}

export interface AiTextDetectionResponse {
    /** This is a standard HTTP status code. A 200 status means the request was successful. */
    status: number;
    /** A "human" score between 0 and 100. A low score means our system believes that the text is written by AI, and a higher score means that the system believes that the text is written by a Human. */
    score: number;
    /** This is an array of sentence objects. Each object contains two fields: text and score. Please note that assessments on smaller samples are less accurate than the general score. */
    sentences: AiTextDetectionSentence[];
    /** The type of input we scan based on the input you provided. It can be `text | file | website` . */
    input: string;
    /** An object with two boolean properties indicating if the text contains zero-width spaces or homoglyph attacks. */
    attack_detected: AiTextDetectionAttackDetected;
    /** A readability score between 0 and 100 that indicates how easy it is to read and understand the text based on the provided language. A higher score means the text is more readable and easier to understand. */
    readability_score: number;
    /** The credits_used field represents the number of credits consumed for processing your request. Each word that is processed by the API consumes one credit. */
    credits_used: number;
    /** The credits_remaining field shows how many credits you have left in your account after your request has been processed. */
    credits_remaining: number;
    /** The model version used to generate the prediction based on the input you provided. */
    version: string;
    /** The language of the text detected. It can be `en | fr | es | pt | nl | de | pl | it | ro | id | tl | ru | bg | zh`. */
    language: string;
}
// End AI Text Detection

// AI Image Detection
export interface AiImageDetectionRequest {
    /** Specifies the URL of the image to scan. The URL must be valid, publicly accessible, and point to an image in one of the following formats: JPG, JPEG, PNG, or WEBP. The image must have a minimum resolution of 256x256 pixels. */
    url: string;
    /** The model version to use. Our latest and most accurate version is "5". Using "latest" will make sure you are always using the latest version. Options: 5, 4, 3, 2, 1, latest. Default: 5
     * @default 5
     */
    version?: string;
}

interface ImageDetectionC2paManifest {
    /** Typically an Internet domain name (without the TLD) for the vendor (i.e. `adobe`, `nytimes`). If provided this will be used as a prefix on generated manifest labels. */
    vendor?: string;
    /** A UserAgent string that will let a user know what software/hardware/system produced this Manifest - names should not contain spaces (defaults to c2patool). */
    claim_generator?: string;
    /** A human-readable string to be displayed as the title for this Manifest (defaults to the name of the file this manifest was embedded in). */
    title?: string;
    /** An array of W3C verifiable credentials objects defined in the c2pa assertion specification. Section 7. */
    credentials?: Record<string, unknown>;
    /** An object with an identifier field with a file path, and a format with the mime type of that file. */
    thumbnail?: Record<string, unknown>;
    /** Ingredients that were used to modify the asset referenced by this Manifest (if any). */
    ingredients?: unknown[];
    /** File paths to assets that were used to modify the asset referenced by this Manifest (if any). This may be a JSON Ingredient definition file. */
    ingredient_paths?: string[];
    /** Objects with label, and data - standard c2pa labels must match values as defined in the c2pa assertion specification. */
    assertions?: Record<string, unknown>;
    /** Signing algorithm: one of [ ps256 | ps384 | ps512 | es256 | es384 | es512 | ed25519]. Defaults to es256. */
    alg?: string;
    /** A URL to an RFC3161 compliant Time Stamp Authority. If missing there will no secure timestamp. */
    ta_url?: string;
    /** File path to a private key file. */
    private_key?: string;
    /** File path to signing cert file. */
    sign_cert?: string;
}

interface ImageDetectionC2pa {
    /** The last manifest in the list of manifests which is the one with the set of content bindings that are able to be validated. */
    active_manifest?: ImageDetectionC2paManifest;
    /** A collection of manifests attached to an asset. Each manifest contains information about the provenance of the asset. Creating or editing an asset using a C2PA-compliant device or tool (for example Adobe Photoshop) adds a new manifest to the manifest store. See more information at the C2PA website (https://c2pa.org/). */
    manifests?: Record<string, ImageDetectionC2paManifest>;
}

interface ImageDetectionExif {
    /** Designates the date and optionally the time the content of the image was created rather than the date of the creation of the digital representation. */
    DateCreated?: string;
    /** A textual description, including captions, of the image. */
    Description?: string;
    /** A brief synopsis of the caption. Headline is not the same as Title. */
    Headline?: string;
    /** The maximum available width in pixels of the original photo from which this photo has been derived by downsizing. */
    MaxAvailWidth?: string;
    /** The maximum available height in pixels of the original photo from which this photo has been derived by downsizing. */
    MaxAvailHeight?: string;
    /** Rating of the image by its user or supplier */
    ImageRating?: string;
    /** Identifier or the name of the person(s) involved in writing, editing or correcting the Description, Alt Text (Accessibility), or Extended Description (Accessibility) of the image. */
    DescriptionWriter?: string;
    /** Artistic, style, journalistic, product or other genre(s) of the image (expressed by a term from any Controlled Vocabulary) */
    Genre?: string;
    /** The licensing parameters of the image expressed in free-text. */
    RightsUsageTerms?: string;
    /** Describes the scene of a photo content. Specifies one ore more terms from the IPTC Scene-NewsCodes. Each Scene is represented as a string of 6 digits in an unordered list. */
    SceneCode?: string;
    /** Information about the ethnicity and other facets of the model(s) in a model-released image. */
    AdditionalModelInformation?: string;
    /** Contains the name of the photographer, but in cases where the photographer should not be identified the name of a company or organisation may be appropriate. */
    Creator?: string;
    /** The credit to person(s) and/or organisation(s) required by the supplier of the image to be used when published. This is a free-text field. */
    CreditLine?: string;
    /** Contains any necessary copyright notice for claiming the intellectual property for this photograph and should identify the current owner of the copyright for the photograph. Other entities like the creator of the photograph may be added in the corresponding field. Notes on usage rights should be provided in Rights usage terms. */
    CopyrightNotice?: string;
    /** Identifies the most recent supplier of the image, who is not necessarily its owner or creator. */
    ImageSupplier?: string;
    /** The location the photo was taken. */
    Locationcreated?: string;
    /** Age of the youngest model pictured in the image, at the time that the image was made. */
    MinorModelAgeDisclosure?: string;
    /** URL referencing a web resource providing a statement of the copyright ownership and usage rights of the image. */
    WebStatementofRights?: string;
    /** Age of the human model(s) at the time this image was taken in a model released image. */
    ModelAge?: string;
    /** Optional identifier assigned by the Image Supplier to the image. */
    ImageSupplierImageID?: string;
    /** A linked rights expression using any rights expression language. */
    LinkedEncodedRightsExpression?: string;
    /** Data mining prohibition or permission, optionally with constraints. */
    DataMining?: string;
    /** A set of metadata about artwork or an object in the image */
    Artwork?: string;
    /** Both a Registry Item Id and a Registry Organisation Id to record any registration of this digital image with a registry. */
    ImageRegistryEntry?: string;
    /** Name of the city of the location shown in the image. This element is at the third level of a top-down geographical hierarchy. */
    City?: string;
    /** Code from a controlled vocabulary for identifying the organisation or company which is featured in the image. */
    CodeofOrganisationFeaturedintheImage?: string;
    /** Identifier(s) of the specific event at which the photo was taken */
    EventIdentifier?: string;
    /** Names or describes the specific event at which the photo was taken. */
    EventName?: string;
    /** Party or parties (person or organisation) which contributed to the image, refinement by the role attribute. */
    Contributor?: string;
    /** Owner or owners of the copyright in the licensed image. */
    CopyrightOwner?: string;
    /** Full name of the country of the location shown in the image. This element is at the top/first level of a top-down geographical hierarchy. The full name should be expressed as a verbal name and not as a code, a code should go to the element CountryCode */
    Country?: string;
    /** Name of the organisation or company which is featured in the image. */
    DigitalSourceType?: string;
    /** Identifier(s) of a Property Release document. */
    PropertyReleaseId?: string;
    /** Summarises the availability and scope of property releases authorising usage of the properties appearing in the photograph. */
    PropertyReleaseStatus?: string;
    /** Name of the organisation or company which is featured in the image. */
    NameofOrganisationFeaturedintheImage?: string;
    /** The name of a person or party who has a role in the content supply chain. This could be an agency, a member of an agency, an individual or a combination. Source could be different from Creator and from the entities in the Copyright Notice. */
    Source?: string;
    /** Globally unique identifier for this digital image. It is created and applied by the creator of the digital image at the time of its creation . This value shall not be changed after that time. */
    DigitalImageGUID?: string;
    /** A person or company that should be contacted to obtain a licence for using the item or who has licensed the item. */
    Licensor?: string;
    /** Keywords to express the subject of the image. Keywords may be free text and don't have to be taken from a controlled vocabulary. Codes from the controlled vocabulary IPTC Subject NewsCodes must go to the Subject Code field. */
    keywords?: string[];
    /** Creator or creators of the image */
    ImageCreator?: Record<string, unknown>;
    /** Any number of instructions from the provider or creator to the receiver of the image */
    Instructions?: string;
    /** A shorthand reference for the digital image. Title provides a short human readable name which can be a text and/or numeric reference. It is not the same as Headline. */
    Title?: string;
}

interface ImageDetectionMetadataAutoOrient {
    /** Number of pixels wide (EXIF orientation is taken into consideration) */
    width: number;
    /** Number of pixels high (EXIF orientation is taken into consideration) */
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
    /** Number value of the EXIF Orientation header, if present */
    orientation?: number;
    /** Name of decoder used to decompress image data e.g. jpeg, png, webp, gif, svg */
    format: string;
    /** Total size of image in bytes, for Stream and Buffer input only */
    size?: number;
    /** Number of pixels wide (EXIF orientation is not taken into consideration) */
    width: number;
    /** Number of pixels high (EXIF orientation is not taken into consideration) */
    height: number;
    /** Any changed metadata after the image orientation is applied */
    autoOrient: ImageDetectionMetadataAutoOrient;
    /** Name of colour space interpretation */
    space: string;
    /** Number of bands e.g. 3 for sRGB, 4 for CMYK */
    channels: number;
    /** Name of pixel depth format e.g. uchar, char, ushort, float */
    depth: string;
    /** Number of pixels per inch (DPI), if present */
    density?: number;
    /** String containing JPEG chroma subsampling, 4:2:0 or 4:4:4 for RGB, 4:2:0:4 or 4:4:4:4 for CMYK */
    chromaSubsampling?: string;
    /** Boolean indicating whether the image is interlaced using a progressive scan */
    isProgressive: boolean;
    /** Boolean indicating whether the image is palette-based (GIF, PNG) */
    isPalette: boolean;
    /** Number of bits per sample for each channel (GIF, PNG) */
    bitsPerSample?: number;
    /** Number of pages/frames contained within the image, with support for TIFF, HEIF, PDF, animated GIF and animated WebP */
    pages?: number;
    /** Number of pixels high each page in a multi-page image will be */
    pageHeight?: number;
    /** Number of times to loop an animated image, zero refers to a continuous loop */
    loop?: number;
    /** Delay in ms between each page in an animated image, provided as an array of integers */
    delay?: number[];
    /** Number of the primary page in a HEIF image */
    pagePrimary?: number;
    /** Boolean indicating the presence of an embedded ICC profile */
    hasProfile: boolean;
    /** Boolean indicating the presence of an alpha transparency channel */
    hasAlpha: boolean;
    /** Default background colour, if present, for PNG (bKGD) and GIF images */
    background?: ImageDetectionMetadataBackgroundRgb | ImageDetectionMetadataBackgroundGray;
    /** Details of each level in a multi-level image provided as an array of objects, requires libvips compiled with support for OpenSlide */
    levels?: Record<string, unknown>[];
    /** Number of Sub Image File Directories in an OME-TIFF image */
    subifds?: number;
    /** The unit of resolution (density) */
    resolutionUnit?: string;
    /** String containing format for images loaded via *magick */
    formatMagick?: string;
    /** Array of keyword/text pairs representing PNG text blocks, if present */
    comments?: Record<string, unknown>[];
}

export interface AiImageDetectionResponse {
    /** The human score that the image is likely to be generated by a human. A low score means our system believes that the image is generated by AI, and a higher score means that the system believes that the image is generated by a Human. The score is between 0 and 100. 0 for AI and 100 for Human. */
    score: number;
    /** The human probability that the image is likely to be generated by a human. The probability is between 0 and 1. */
    human_probability: number;
    /** The AI probability that the image is likely to be generated by an AI. The probability is between 0 and 1. */
    ai_probability: number;
    /** The model version used to generate the prediction. */
    version: string;
    /** The mime type of the image. */
    mime_type: string;
    /** The Content Provenance and Authenticity (C2PA) metadata of the image. For more information about what is C2PA, please visit `https://c2pa.org/` */
    c2pa?: ImageDetectionC2pa;
    /** The exif metadata of the image. We currently retrieve the XMP, EXIF, and IPTC metadata of the image to help us determine if the image was AI generated. For more information about the IPTC metadata, please visit `https://iptc.org/` */
    exif?: ImageDetectionExif;
    /** Image metadata including dimensions, format, color space, and other technical details */
    metadata: ImageDetectionMetadata;
    /** Whether an AI watermark was detected in the image. */
    ai_watermark_detected: boolean;
    /** The list of AI watermark issuers detected in the image. */
    ai_watermark_issuers?: Record<string, unknown>;
    /** The credits_used field represents the number of credits consumed for processing your request. Each image that is processed by the API consumes 300 credits. */
    credits_used: number;
    /** The credits_remaining field shows how many credits you have left in your account after your request has been processed. */
    credits_remaining: number;
}
// End AI Image Detection

// Advanced AI Image Detection
export interface AdvancedAiImageDetectionRequest {
    /** Public HTTP or HTTPS URL of the image to analyze. The API rejects empty values, non-string values, URLs without a hostname, URLs with embedded credentials, `localhost`, `.localhost`, and direct private or reserved IP addresses. */
    image_url: string;
}

interface AdvancedAiImageDetectionToolAnalysis {
    /** Internal ID of the forensic tool. Examples: `extract_metadata`, `classify_image`, `ela_image`. */
    id: string;
    /** Natural-language explanation of what the tool result indicates. */
    analysis: string;
    /** Structured tool output when the tool returns data, such as metadata or classification scores. For generated image artifacts (e.g. ELA heatmaps), this is a temporary presigned S3 URL valid for 5 minutes. */
    result: Record<string, unknown> | string;
}

export interface AdvancedAiImageDetectionResponse {
    /** Internal analysis status from the image analysis pipeline. The external HTTP status for a successful API request is 200 OK. */
    status: number;
    /** Number of credits charged for this API request. Current value is 500. */
    cost: number;
    /** Language used for the generated analysis text. */
    language: string;
    /** Short generated title describing the analyzed image. */
    title: string;
    /** Tags extracted or inferred from the image metadata and analysis pipeline. */
    tags: string[];
    /** List of internal forensic tool IDs used during the analysis. Possible values include `classify_image`, `extract_metadata`, `ela_image`, `residual_noise_maps`, `edge_anomaly_heat_map`, and `cfa_pattern_analysis`. */
    tool_used: string[];
    /** Final classification label for the image. */
    label: "AI-Generated" | "Human";
    /** Confidence level for the final classification. */
    confidence: "High" | "Moderate" | "Low";
    /** Final authenticity assessment. */
    authenticity: "Authentic" | "Manipulated";
    /** Short final conclusion summarizing the forensic result. */
    conclusion: string;
    /** Complete human-readable forensic analysis, including a summary of the tools used and their findings. */
    analysis: string;
    /** Per-tool analysis results. Each item contains the tool ID, a generated explanation of that tool's result, and the underlying tool output. */
    tools_used_analysis: AdvancedAiImageDetectionToolAnalysis[];
    /** User's remaining credit balance after the successful request is charged. */
    balance: number;
}
// End Advanced AI Image Detection

// Plagiarism Detection
export interface PlagiarismRequest {
    /** The text to be scanned. This is required unless you provide a website or file. Each request must contain at least 100 characters and no more than 120,000 characters. */
    text?: string;
    /** A publicly accessible URL to a file to scan. The file must be publicly available online (not a local file path) so our API can access it. The file must be in plain .pdf, .doc or .docx format. The file has priority over the text, so if you give a text and a file, it's the file that will be scanned. */
    file?: string;
    /** A website URL to scan. If you supply a website, the API will fetch the content of the website and scan it. The website must be publicly accessible. It's important to know that the website has priority over the text and the file, so if you give a text, a file and a website, it's the website that will be scanned. */
    website?: string;
    /** An array of sources to exclude from the scan. The excluded sources won't be taken into account for the plagiarism scan score. Sources can either be a domain name like `example.com` or a url like `https://example.com`. If you specify a domain name, the API will exclude all the urls belonging to that domain and all subdomains. Sources are case-sensitive. */
    excluded_sources?: string[];
    /** 2 letter language code. Default: auto.

    If you put 'auto', the API will automatically detect the language of the text.

    The plagiarism-checking endpoint currently supports 47 languages:
    English (en), French (fr), German (de), Spanish (es), Portuguese (pt), Dutch (nl), Italian (it), Chinese (zh), Norwegian (no), Swedish (sv), Danish (da), Finnish (fi), Icelandic (is), Irish (ga), Polish (pl), Czech (cs), Slovak (sk), Romanian (ro), Hungarian (hu), Bulgarian (bg), Croatian (hr), Greek (el), Turkish (tr), Hebrew (he), Arabic (ar), Vietnamese (vi), Malay (ms), Thai (th), Korean (ko), Japanese (ja), Russian (ru), Kazakh (kk), Georgian (ka), Tagalog (tl), Hindi (hi), Bengali (bn), Persian (fa), Urdu (ur), Indonesian (id), Malayalam (ml), Tamil (ta), Telugu (te), Kannada (kn), Marathi (mr), Gujarati (gu), Ukrainian (uk) and Albanian (sq).
     * @default auto
     */
    language?: string;
    /** The country code of the country where the text was written. We accept all country codes. Default: us.
     * @default us
     */
    country?: string;
}

interface PlagiarismScanInformation {
    /** Name of the service used for the request. */
    service: string;
    /** Timestamp when the scan was conducted. */
    scanTime: string;
    /** The type of input we scan based on the input you provided. It can be `text | file | website` . */
    inputType: string;
    /** The language of the text detected. */
    language: string;
}

interface PlagiarismResult {
    /** Plagiarism score indicating the percentage of plagiarized content in the scanned text. */
    score: number;
    /** Number of sources identified during the scan that contain plagiarized content. */
    sourceCounts: number;
    /** Total number of words in the scanned text. */
    textWordCounts: number;
    /** Total number of words identified as plagiarized. */
    totalPlagiarismWords: number;
    /** Number of words identified as plagiarized that are identical to the source content. */
    identicalWordCounts: number;
    /** Number of words identified as plagiarized that are similar to the source content. */
    similarWordCounts: number;
}

interface PlagiarismFoundSequence {
    /** Starting index of the plagiarized sequence in the text. */
    startIndex: number;
    /** Ending index of the plagiarized sequence in the text. */
    endIndex: number;
    /** The plagiarized text sequence. */
    sequence: string | null;
}

interface PlagiarismSource {
    /** The plagiarism percentage score for this specific source. */
    score: number;
    /** Indicates if we were able to access the source content. */
    canAccess: boolean;
    /** URL of the source where plagiarism was found. */
    url: string;
    /** Title of the source document. */
    title: string;
    /** Number of words in the input text identified as plagiarized from this source found. */
    plagiarismWords: number;
    /** Number of words identified as plagiarized that are identical to the source content. */
    identicalWordCounts: number;
    /** Number of words identified as plagiarized that are similar to the source content. */
    similarWordCounts: number;
    /** Total number of words in the input text. */
    totalNumberOfWords: number;
    /** Author of the source document. */
    author: string | null;
    /** Description or summary of the source content. */
    description: string | null;
    /** Timestamp of when the source was published. */
    publishedDate: number | null;
    /** Name of the source or publication. */
    source: string | null;
    /** Indicates if the source is cited in the input text. */
    citation: boolean;
    /** List of plagiarism sequence found in the input text from this source. */
    plagiarismFound: PlagiarismFoundSequence[];
    /** Indicates if this source should be excluded from the final results. */
    is_excluded: boolean;
}

interface PlagiarismAttackDetected {
    /** Indicates if the text contains zero-width spaces. */
    zero_width_space: boolean;
    /** Indicates if the text contains homoglyph attacks. */
    homoglyph_attack: boolean;
}

interface PlagiarismSimilarWord {
    /** Starting index of the similar word in the document. */
    index: number;
    /** The similar word. */
    word: string;
}

export interface PlagiarismResponse {
    /** HTTP status code representing the result of the plagiarism scan request. */
    status: number;
    /** Some basic scan information about the request. */
    scanInformation: PlagiarismScanInformation;
    /** The result field is the main object that contains the results of the plagiarism scan. */
    result: PlagiarismResult;
    /** The sources field is an array which contains one or more objects, each corresponding to a different website where matching content has been found. */
    sources: PlagiarismSource[];
    /** An object with two boolean properties indicating if the text contains zero-width spaces or homoglyph attacks. */
    attackDetected: PlagiarismAttackDetected;
    /** The input text that was used for the plagiarism scan. */
    text: string;
    /** List of similar words found in the input text. */
    similarWords: PlagiarismSimilarWord[];
    /** The citations is an array which contains one or more objects, each corresponding to a different website where the website was cited in the provided text. */
    citations: string[];
    /** List of plagiarism sequences found in the input text. */
    indexes: PlagiarismFoundSequence[];
    /** The credits_used field represents the number of credits consumed for processing your request. Each word that is processed by the API consumes two credits. */
    credits_used: number;
    /** The credits_remaining field shows how many credits you have left in your account after your request has been processed. */
    credits_remaining: number;
}
// End Plagiarism Detection

// Fact Check
export interface FactCheckRequest {
    /** The text to scan. It is required except if you supply a website or a file. Minimum 300 characters. Maximum 10,000 characters per request. */
    text?: string;
    /** A publicly accessible URL to a file to scan. The file must be publicly available online (not a local file path) so our API can access it. The file must be in plain .pdf, .doc or .docx format. The file has priority over the text, so if you give a text and a file, it's the file that will be scanned. */
    file?: string;
    /** A website URL to scan. If you supply a website, the API will fetch the content of the website and scan it. The website must be publicly accessible. It's important to know that the website has priority over the text and the file, so if you give a text, a file and a website, it's the website that will be scanned. */
    website?: string;
    /** 2 letter language code. Default: auto.

    If you put 'auto', the API will automatically detect the language based on the text.

    Supported languages:

    Arabic (ar), Bengali (bn), Bulgarian (bg), Chinese simplified and traditional (zh), Croatian (hr), Czech (cs), Danish (da), Dutch (nl), English (en), Estonian (et), Finnish (fi), French (fr), German (de), Greek (el), Hebrew (he), Hindi (hi), Hungarian (hu), Indonesian (id), Italian (it), Japanese (ja), Korean (ko), Latvian (lv), Lithuanian (lt), Norwegian (no), Polish (pl), Portuguese (pt), Romanian (ro), Russian (ru), Serbian (sr), Slovak (sk), Slovenian (sl), Spanish (es), Swahili (sw), Swedish (sv), Thai (th), Turkish (tr), Ukrainian (uk), Vietnamese (vi).
     * @default auto
     */
    language?: string;
}

interface FactCheckLink {
    /** URL of the supporting reference. */
    url: string;
    /** Title or domain of the referenced article. */
    title: string;
}

interface FactCheckClaim {
    /** The unique identifier of the sentence in the input text. */
    id: number;
    /** Exact input sentence from which the claim was extracted. */
    sentence: string;
    /** The distinct claim to be fact-checked. */
    claim: string;
    /** Fact-checking verdict about the claim. */
    verdict: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "NOT_ENOUGH_EVIDENCE" | "REFUTED";
    /** Confidence score (0-100) for the verdict. */
    score: number;
    /** Explanation of the verdict, including supporting reasoning and factual basis. */
    explanation: string;
    /** List of supporting sources for the claim. */
    links: FactCheckLink[];
}

interface FactCheckSentence {
    /** Unique identifier for the sentence in the input text. */
    id: number;
    /** Sentence text. */
    text: string;
}

export interface FactCheckResponse {
    /** HTTP status code for the response */
    status: number;
    /** List of claims detected in the text along with their fact-checking results. */
    claims: FactCheckClaim[];
    /** Overall confidence score (0-100) that the provided text is accurate. */
    score: number;
    /** Total number of claims extracted from the text. Maximum 12 per request. */
    claimsCount: number;
    /** The full original text that was analyzed. */
    text: string;
    /** List of sentences from the analyzed text, with IDs for mapping claims to the sentences. */
    sentences: FactCheckSentence[];
    /** Indicates the input type, e.g., 'text', 'file', or 'website'. */
    input: string;
    /** Detected or specified input language (2 letter code). */
    language: string;
    /** The number of credits used to process this request. */
    creditsUsed: number;
    /** The number of remaining credits for the account. */
    creditsRemaining: number;
    /** Word count of the input text. */
    wordCount: number;
}
// End Fact Check

// Text Compare
export interface TextCompareRequest {
    /** The first text to compare. Maximum 120,000 characters. */
    first_text: string;
    /** The second text to compare against the first text. Maximum 120,000 characters. */
    second_text: string;
}

interface TextCompareInformation {
    /** Total number of words in the text */
    total_word_count: number;
    /** Number of words that match with the other text */
    matching_word_count: number;
    /** Percentage of matching content in the text */
    similarity_percentage: number;
    /** List of matching segments in the text */
    items: TextCompareItem[];
};

interface TextCompareItem {
    /** Type of match (identical, similar, etc.) */
    type: string;
    /** Number of words in this segment */
    word_count: number;
    /** Starting index of the segment in the text */
    index_start: number;
    /** Length of the segment in characters */
    length: number;
};

export interface TextCompareResponse {
    /** HTTP status code representing the result of the text comparison request */
    status: number;
    /** Overall similarity score between the two texts (0-100).

    0 means no similarity, 100 means identical. */
    similarity_score: number;
    first_text: TextCompareInformation;
    second_text: TextCompareInformation;
    /** The credits_used field represents the number of credits consumed for processing your request. Each text comparison request consumes the total number of words in both texts divided by 2. */
    credits_used: number;
    /** The credits_remaining field shows how many credits you have left in your account after your request has been processed. */
    credits_remaining: number;
}
// End Text Compare
