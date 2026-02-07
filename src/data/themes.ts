export interface Act {
    label: string; // The specific situation e.g. "Anger"
    id: string; // A-H or 1-8
}

export interface Theme {
    id: string;
    title: string; // "Haa", "Nande", etc.
    acts: Act[]; // 8 variations
}

export const THEMES: Theme[] = [
    {
        id: 'haa',
        title: 'はぁ',
        acts: [
            { id: 'A', label: '何で？の「はぁ」' },
            { id: 'B', label: '力をためる「はぁ」' },
            { id: 'C', label: 'ぼうぜんの「はぁ」' },
            { id: 'D', label: '感心の「はぁ」' },
            { id: 'E', label: '怒りの「はぁ」' },
            { id: 'F', label: '失恋の「はぁ」' },
            { id: 'G', label: 'とぼける「はぁ」' },
            { id: 'H', label: 'おどろきの「はぁ」' },
        ],
    },
    {
        id: 'nande',
        title: 'なんで',
        acts: [
            { id: 'A', label: 'あきれた「なんで」' },
            { id: 'B', label: '問いただす「なんで」' },
            { id: 'C', label: '絶望の「なんで」' },
            { id: 'D', label: '断る時の「なんで」' },
            { id: 'E', label: '理解できない「なんで」' },
            { id: 'F', label: '怒りの「なんで」' },
            { id: 'G', label: '笑いながら「なんで」' },
            { id: 'H', label: '自分のせい？「なんで」' },
        ],
    },
    {
        id: 'wink',
        title: 'ウィンク',
        acts: [
            { id: 'A', label: 'セクシーなウインク' },
            { id: 'B', label: '手についたゴミをとるふりしてウィンク' },
            { id: 'C', label: '「あとでね」の合図のウィンク' },
            { id: 'D', label: '目にゴミが入ったふりしてウィンク' },
            { id: 'E', label: '下手なウィンク' },
            { id: 'F', label: 'かっこつけウィンク' },
            { id: 'G', label: 'ばれないようにウィンク' },
            { id: 'H', label: '両目をつぶってしまうウィンク' },
        ],
    },
];
