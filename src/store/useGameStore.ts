// Created: 2026-08-13
import { create } from 'zustand';

export type LetterStatus = 'unchecked' | 'match' | 'noMatch' | 'matchInOtherPlace';

export type Letter = {
    index: number,
    value: string;
    isActive: boolean;
    status: LetterStatus;
};

type WordStatus = 'unfinished' | 'completed';

type Word = {
    letters: Letter[];
    currentWord: string;
    isWordComplete: boolean;
    status: WordStatus;
};

export type Attempt = {
    index: number,
    isCurrentAttempt: boolean,
    word: Word,
}

type Game = {
    currentAttempt: number,
    isGameFinished: boolean,
    attempts: Attempt[],
};

type GameStore = {
    // Letter
    currentLetter: Letter;
    activateLetter: (index: number, letter: string | undefined, isActive: boolean) => void;

    // Word
    moveOneLetterBack: (index: number) => void;
    currentWord: Word;
    addLetterToWord: (index: number, letter: string | undefined) => void;
    checkWord: (guessedWord: Letter[]) => void;
    deleteWord: () => void;

    // Game
    currentGame: Game;
    addLetterToCurrentAttempt: (attempt: Attempt, letterIndex: number, letter: string | undefined) => void;
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
    status: 'unfinished',
    isWordComplete: false,
};

const initialLetter: Letter = {
    index: 0,
    value: '',
    isActive: true,
    status: 'unchecked',
}

const initialGame: Game = {
    currentAttempt: 0,
    isGameFinished: false,
    attempts: [
        { index: 0, isCurrentAttempt: true, word: initialWord },
        { index: 1, isCurrentAttempt: false, word: initialWord },
        { index: 2, isCurrentAttempt: false, word: initialWord },
        { index: 3, isCurrentAttempt: false, word: initialWord },
        { index: 4, isCurrentAttempt: false, word: initialWord },
        { index: 5, isCurrentAttempt: false, word: initialWord },
    ],
}

const useGameStore = create<GameStore>((set) => ({

    currentGame: initialGame,

    // TODO später im Fake-Backend/Backend prüfen
    answerWord: [
        { index: 0, value: 'W', isActive: false },
        { index: 1, value: 'E', isActive: false },
        { index: 2, value: 'R', isActive: false },
        { index: 3, value: 'T', isActive: false },
        { index: 4, value: 'E', isActive: false },
    ],

    checkWord: (guessedWord) => set((state) => {
        const answerWord = ['W', 'E', 'R', 'T', 'E']; // kommt später vom Backend

        // Buchstabenanzahl vom Lösungswort
        // z. B. WERTE {"letterRecord": {"E": 2, "R": 1, "T": 1, "W": 1}}
        const letterRecord: Record<string, number> = answerWord.reduce((acc, char) => {
            acc[char] = (acc[char] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const letterGuess = guessedWord;

        // Beim einem Match wird die Buchstabenanzahl reduziert um 1
        // z. B. E E E W W {"letterStatuses": ["", "match", "", "", ""]}
        const letterStatuses: Array<Letter['status'] | ''> = letterGuess.map((item, index) => {
            if (item.value === answerWord[index]) {
                // Bei einem Match, wird der Zähler um 1 für z. B. "E": 2 um 1 reduziert
                letterRecord[item.value] = letterRecord[item.value] - 1;
                return 'match';
            }
            return "";
        });

        // Überprüft alles was kein 'match' ist und reduziert den Zähler um 1
        // z. B. E E E W W {"finalStatuses": ["matchInOtherPlace", "match", "noMatch", "matchInOtherPlace", "noMatch"]}
        const finalStatuses: Letter['status'][] = letterStatuses.map((status, index) => {
            if (status === 'match') return 'match';

            // Einzelbuchstaben z. B. E, E, E, W, W
            const letter = letterGuess[index].value;
            if (letterRecord[letter] > 0) {
                letterRecord[letter] = letterRecord[letter] - 1;
                return 'matchInOtherPlace';
            }
            return 'noMatch';
        });

        const nextLetters: Letter[] = letterGuess.map((item, index) => ({
            ...item,
            status: finalStatuses[index],
            isActive: false,
        }));

        const currentAttemptIndex = state.currentGame.currentAttempt;
        const nextAttempts: Attempt[] = state.currentGame.attempts.map((attempt, index) => {
            if (index !== currentAttemptIndex) {
                return attempt;
            }

            const nextWord: Word = {
                ...attempt.word,
                letters: nextLetters,
                status: 'completed',
                isWordComplete: true,
            };

            return {
                ...attempt,
                isCurrentAttempt: false,
                word: nextWord,
            };
        });

        const nextCurrentWord: Word = {
            ...state.currentWord,
            letters: nextLetters,
            status: 'completed',
            isWordComplete: true,
        };

        return {
            currentWord: nextCurrentWord,
            currentGame: {
                ...state.currentGame,
                attempts: nextAttempts,
            },
        };
    }),

    currentLetter: initialLetter,
    activateLetter: (index, letter, isActive) => set((state) => {
        const activeAttempt = state.currentGame.attempts[state.currentGame.currentAttempt];
        const nextLetters = activeAttempt.word.letters.map((item, currentIndex) =>
            currentIndex === index ? { ...item, value: activeAttempt.word.letters[index].value, isActive }
                : { ...item, isActive: false },
        );

        const allValuesSet = nextLetters.every(item => item.value !== "");
        const nextAttempts = state.currentGame.attempts.map((attempt, currentIndex) =>
            currentIndex === state.currentGame.currentAttempt
                ? { ...attempt, word: { ...attempt.word, letters: nextLetters, isWordComplete: allValuesSet } }
                : attempt,
        );

        return {
            currentLetter: {
                ...state.currentLetter,
                index,
                value: letter ?? '',
                isActive
            },
            currentWord: {
                ...state.currentWord,
                letters: nextLetters,
                isWordComplete: allValuesSet,
            },
            currentGame: {
                ...state.currentGame,
                attempts: nextAttempts,
            },
        };

    }),

    moveOneLetterBack: (index) => set((state) => {
        const currentAttemptIndex = state.currentGame.currentAttempt;
        const letters = state.currentGame.attempts[currentAttemptIndex].word.letters;
        // Boolean der prüft, ob im letzten Wort, der Wert nicht mehr leer ist
        // 1) index === letters.length - 1
        // 1) Erklärung: Vergleicht index und letters Länge (ist immer 5 - 1 = 4)
        // 2) letters[index].value !== ""
        // 2) Erklärung: prüft, ob im letzten Wort der Wert nicht leer ist
        const isLastFilledBox = index === letters.length - 1 && letters[index].value !== "";

        // Fall 1: Cursor steht auf der letzten, bereits befüllten Box
        // → diese Box selbst leeren und aktiv lassen
        if (isLastFilledBox) {
            const nextLetters: Letter[] = letters.map((item, itemIndex) => {
                if (itemIndex === index) {
                    return { ...item, value: "", isActive: true }
                }

                return item;
            });

            const nextAttempts: Attempt[] = state.currentGame.attempts.map((attempt, currentIndex) =>
                currentIndex === currentAttemptIndex
                    ? { ...attempt, word: { ...attempt.word, letters: nextLetters, isWordComplete: false } }
                    : attempt,
            );

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
                currentGame: {
                    ...state.currentGame,
                    attempts: nextAttempts,
                },
            };
        }

        // Fall 2: Cursor steht auf einer leeren, aktiven Box
        // → vorherige Box leeren und dorthin springen
        const targetIndex = index - 1;
        // TODO: Das prüfe ich beim Code, fragen wohin man das besser auslagert
        if (targetIndex < 0) return state;

        const nextLetters: Letter[] = letters.map((item, itemIndex) => {
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

        const nextAttempts: Attempt[] = state.currentGame.attempts.map((attempt, currentIndex) =>
            currentIndex === currentAttemptIndex
                ? { ...attempt, word: { ...attempt.word, letters: nextLetters, isWordComplete: false } }
                : attempt,
        );

        return {
            currentLetter: { ...state.currentLetter, index: targetIndex },
            currentWord: { ...state.currentWord, letters: nextLetters, isWordComplete: false },
            currentGame: {
                ...state.currentGame,
                attempts: nextAttempts,
            },
        };
    }),

    currentWord: initialWord,

    addLetterToWord: (index, letter) => set((state) => {

        // TODO const for wordLength index < 4
        const nextActiveIndex = index < 4
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
                ...state.currentLetter,
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
    deleteWord: () => set((state) => {
        const currentAttemptIndex = state.currentGame.currentAttempt;

        const nextAttempts = state.currentGame.attempts.map((attempt, index) => {
            if (index !== currentAttemptIndex) {
                return attempt;
            }

            return {
                ...attempt,
                word: initialWord,
            };
        });

        return {
            currentWord: initialWord,
            currentLetter: initialLetter,
            currentGame: {
                ...state.currentGame,
                attempts: nextAttempts,
            },
        };
    }),

    addLetterToCurrentAttempt: (attempt, letterIndex, letter) => set((state) => {

        // TODO const for wordLength index < 4
        const nextActiveIndex = letterIndex < 4
            ? letterIndex + 1
            : letterIndex;

        const nextAttempts = state.currentGame.attempts.map((currentAttempt, currentIndex) => {
            // Andere Attempts unverändert zurückgeben
            if (attempt.index !== currentIndex) {
                return currentAttempt;
            }

            const nextLetters = currentAttempt.word.letters.map((item, currentIndex) => {
                // Last Letter in Word
                if (currentIndex === 4 && letterIndex === 4) {
                    return { ...item, value: letter ?? '', isActive: false };
                }

                // Last Typed Letter
                if (currentIndex === letterIndex) {
                    return { ...item, value: letter ?? '', isActive: false };
                }

                return {
                    ...item,
                    isActive: currentIndex === nextActiveIndex,
                };
            });

            console.log(nextLetters);


            return {
                ...currentAttempt,
                word: {
                    ...currentAttempt.word,
                    letters: nextLetters,
                },
            };
        });

        return {
            currentLetter: {
                ...state.currentLetter,
                // TODO wordlength checken
                index: letterIndex == 4 ? letterIndex : letterIndex + 1,
                letter,
                isActive: true
            },
            currentGame: {
                ...state.currentGame,
                attempts: nextAttempts,
            },
        };
    }),
}));

export default useGameStore;