export default class EffectParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EffectParseError';
    }
}
