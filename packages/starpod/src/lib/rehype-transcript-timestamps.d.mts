type RehypeTranscriptTimestamps = () => (tree: unknown) => void;

declare const rehypeTranscriptTimestamps: RehypeTranscriptTimestamps;
/** A turn with more words than this is long enough for its head to stick. */
export declare const LONG_TURN: number;
/** Turns per group in a long transcript. */
export declare const TURNS_PER_GROUP: number;
export default rehypeTranscriptTimestamps;
