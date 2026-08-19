// Created: 2026-08-13
import { create } from 'zustand';

type Letter = {
    index: number,
    value: string;
    isActive: boolean;
};

type Word = {
    letters: Letter[];
    currentWord: string;
    wordLength: number;
    isWordComplete: boolean;
};

type GameStore = {
    currentLetter: Letter;
    activateLetter: (index: number, letter: Letter, isActive: boolean) => void;

    moveOneLetterBack: (index: number) => void;

    currentWord: Word;
    addLetterToWord: (index: number, letter: string | undefined) => void;
    deleteWord: () => void;
};

const initialWord: Word = {
    letters: [
        { index: 0, value: '', isActive: true },
        { index: 1, value: '', isActive: false },
        { index: 2, value: '', isActive: false },
        { index: 3, value: '', isActive: false },
        { index: 4, value: '', isActive: false },
    ],
    currentWord: '',
    wordLength: 5,
    isWordComplete: false,
};

const initialLetter: Letter = {
    index: 0, value: '', isActive: true
}

const useGameStore = create<GameStore>((set) => ({
    // TODO Hier das currentLetter Object holen
    currentLetter: initialLetter,
    activateLetter: (index, letter, isActive) => set((state) => {
        const nextLetters = state.currentWord.letters.map((item, currentIndex) =>
            currentIndex === index ? { ...item, value: state.currentWord.letters[index].value, isActive }
                : { ...item, isActive: false },
        );

        console.log(nextLetters);


        // TODO
        // Rest muss ja isActive: false haben

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

        // TODO das müsste ich ja generell haben?
        const nextActiveIndex = index < state.currentWord.wordLength - 1
            ? index + 1
            : index;

        console.log(state.currentWord.letters);

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