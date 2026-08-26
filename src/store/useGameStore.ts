// Created: 2026-08-13
import { create } from 'zustand';

export type LetterStatus = 'unchecked' | 'match' | 'noMatch' | 'matchInOtherPlace';

export type Letter = {
    index: number,
    value: string;
    isActive: boolean;
    status: LetterStatus;
};

type Word = {
    letters: Letter[];
    currentWord: string;
    wordLength: number;
    isWordComplete: boolean;
};

type GameStore = {
    // Letter
    currentLetter: Letter;
    activateLetter: (index: number, letter: Letter, isActive: boolean) => void;

    // Word
    moveOneLetterBack: (index: number) => void;
    currentWord: Word;
    addLetterToWord: (index: number, letter: string | undefined) => void;
    checkWord: () => void;
    deleteWord: () => void;
};

const initialWord: Word = {
    letters: [
        { index: 0, value: '', isActive: true, status: 'unchecked' },
        { index: 1, value: '', isActive: false, status: 'unchecked' },
        { index: 2, value: '', isActive: false, status: 'unchecked' },
        { index: 3, value: '', isActive: false, status: 'unchecked' },
        { index: 4, value: '', isActive: false, status: 'unchecked' },
    ],
    currentWord: '',
    wordLength: 5,
    completeWord: '',
    isWordComplete: false,
};

const initialLetter: Letter = {
    index: 0, value: '', isActive: true
}

const useGameStore = create<GameStore>((set) => ({

    // TODO später im Fake-Backend/Backend prüfen
    answerWord: [
        { index: 0, value: 'W', isActive: false },
        { index: 1, value: 'E', isActive: false },
        { index: 2, value: 'R', isActive: false },
        { index: 3, value: 'T', isActive: false },
        { index: 4, value: 'E', isActive: false },
    ],

    checkWord: () => set((state) => {
        const answerWord = ['W', 'E', 'R', 'T', 'E']; // kommt später vom Backend

        // Buchstabenanzahl vom Lösungswort
        // z. B. WERTE {"letterRecord": {"E": 2, "R": 1, "T": 1, "W": 1}}
        const letterRecord: Record<string, number> = answerWord.reduce((acc, char) => {
            acc[char] = (acc[char] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const letterGuess = state.currentWord.letters;

        // Beim einem Match wird die Buchstabenanzahl reduziert um 1
        // z. B. E E E W W {"letterStatuses": ["", "match", "", "", ""]}
        const letterStatuses: (Letter['status'])[] = letterGuess.map((item, index) => {
            if (item.value === answerWord[index]) {
                // Bei einem Match, wird der Zähler um 1 für z. B. "E": 2 um 1 reduziert
                letterRecord[item.value] = letterRecord[item.value] - 1;
                return 'match';
            }
            return "";
        });

        console.log({ letterStatuses });

        // Überprüft alles was kein 'match' ist und reduziert den Zähler um 1
        // z. B. E E E W W {"finalStatuses": ["matchInOtherPlace", "match", "noMatch", "matchInOtherPlace", "noMatch"]}
        const finalStatuses = letterStatuses.map((status, index) => {
            if (status === 'match') return 'match';

            // Einzelbuchstaben z. B. E, E, E, W, W
            const letter = letterGuess[index].value;
            if (letterRecord[letter] > 0) {
                letterRecord[letter] = letterRecord[letter] - 1;
                return 'matchInOtherPlace';
            }
            return 'noMatch';
        });

        const nextLetters = letterGuess.map((item, index) => ({
            ...item,
            status: finalStatuses[index],
            isActive: false,
        }));

        return {
            currentWord: {
                ...state.currentWord,
                letters: nextLetters,
            },
        };
    }),

    currentLetter: initialLetter,
    activateLetter: (index, letter, isActive) => set((state) => {
        const nextLetters = state.currentWord.letters.map((item, currentIndex) =>
            currentIndex === index ? { ...item, value: state.currentWord.letters[index].value, isActive }
                : { ...item, isActive: false },
        );

        const allValuesSet = nextLetters.every(item => item.value !== "");

        return {
            currentLetter: {
                index,
                letter,
                isActive
            },
            currentWord: {
                ...state.currentWord,

                letters: nextLetters,
                isWordComplete: allValuesSet,
            },
        };

    }),

    moveOneLetterBack: (index) => set((state) => {
        // Aktuelle Letters
        const letters = state.currentWord.letters;
        // Boolean der prüft, ob im letzten Wort, der Wert nicht mehr leer ist
        // 1) index === letters.length - 1
        // 1) Erklärung: Vergleicht index und letters Länge (ist immer 5 - 1 = 4)
        // 2) letters[index].value !== ""
        // 2) Erklärung: prüft, ob im letzten Wort der Wert nicht leer ist
        const isLastFilledBox = index === letters.length - 1 && letters[index].value !== "";

        // Fall 1: Cursor steht auf der letzten, bereits befüllten Box
        // → diese Box selbst leeren und aktiv lassen
        if (isLastFilledBox) {
            const nextLetters = letters.map((item, itemIndex) => {
                if (itemIndex === index) {
                    return { ...item, value: "", isActive: true }
                }

                return item;
            });

            return {
                currentLetter: {
                    ...state.currentLetter,
                    index
                },
                currentWord: {
                    ...state.currentWord,
                    letters: nextLetters,
                    isWordComplete: false
                },
            };
        }

        // Fall 2: Cursor steht auf einer leeren, aktiven Box
        // → vorherige Box leeren und dorthin springen
        const targetIndex = index - 1;
        // TODO: Das prüfe ich beim Code, fragen wohin man das besser auslagert
        if (targetIndex < 0) return state;

        const nextLetters = letters.map((item, itemIndex) => {
            // Vorheriger Buchstaben löschen und Wert auf "" setzen und aktivieren
            if (itemIndex === targetIndex) {
                return { ...item, value: "", isActive: true };
            }

            // Aktueller Buchstaber der reingegeben wird deaktiviert und der Wert gelöscht
            if (itemIndex === index) {
                return { ...item, value: "", isActive: false };
            }

            return item;
        });

        return {
            currentLetter: { ...state.currentLetter, index: targetIndex },
            currentWord: { ...state.currentWord, letters: nextLetters, isWordComplete: false },
        };
    }),

    currentWord: initialWord,

    addLetterToWord: (index, letter) => set((state) => {

        const nextActiveIndex = index < state.currentWord.wordLength - 1
            ? index + 1
            : index;

        const nextLetters = state.currentWord.letters.map((item, currentIndex) => {
            // Last Letter in Word
            if (currentIndex === 4 && index === 4) {
                return { ...item, value: letter ?? '', isActive: false };
            }

            // Last Typed Letter
            if (currentIndex === index) {
                return { ...item, value: letter ?? '', isActive: false };
            }

            return {
                ...item,
                isActive: currentIndex === nextActiveIndex,
            };
        });

        const nextWord = nextLetters.map((item) => item.value).join('');

        const allValuesSet = nextLetters.every(item => item.value !== "");


        return {
            currentLetter: {
                // TODO wordlength checken
                index: index == 4 ? index : index + 1,
                letter,
                isActive: true
            },
            currentWord: {
                ...state.currentWord,
                letters: nextLetters,
                currentWord: nextWord,
                isWordComplete: allValuesSet,
            },
        };
    }),
    deleteWord: () => set({ currentWord: initialWord, currentLetter: initialLetter }),
}));

export default useGameStore;