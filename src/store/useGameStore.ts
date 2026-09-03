// Created: 2026-08-13
import { create } from 'zustand';

export type LetterStatus = 'unchecked' | 'match' | 'noMatch' | 'matchInOtherPlace';

export type Letter = {
    index: number,
    value: string;
    isActive: boolean;
    status: LetterStatus;
};

type WordStatus = 'unfinished' | 'filled' | 'completed';

type Word = {
    letters: Letter[];
    currentWord: string;
    isWordChecked: boolean;
    status: WordStatus;
};

export type Attempt = {
    index: number,
    isCurrentAttempt: boolean,
    word: Word,
}

type GameStatus = 'open' | 'lose' | 'win';

type Game = {
    currentAttempt: number,
    isGameFinished: boolean,
    attempts: Attempt[],
    status: GameStatus;
};

type GameStore = {
    // Letter
    currentLetter: Letter;
    activateLetter: (index: number, letter: string | undefined, isActive: boolean) => void;

    // Word
    moveOneLetterBack: (index: number) => void;
    currentWord: Word;
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
    isWordChecked: false,
};

const initialInactiveWord: Word = {
    letters: [
        { index: 0, value: '', isActive: false, status: 'unchecked' },
        { index: 1, value: '', isActive: false, status: 'unchecked' },
        { index: 2, value: '', isActive: false, status: 'unchecked' },
        { index: 3, value: '', isActive: false, status: 'unchecked' },
        { index: 4, value: '', isActive: false, status: 'unchecked' },
    ],
    currentWord: '',
    status: 'unfinished',
    isWordChecked: false,
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
        { index: 1, isCurrentAttempt: false, word: initialInactiveWord },
        { index: 2, isCurrentAttempt: false, word: initialInactiveWord },
        { index: 3, isCurrentAttempt: false, word: initialInactiveWord },
        { index: 4, isCurrentAttempt: false, word: initialInactiveWord },
        { index: 5, isCurrentAttempt: false, word: initialInactiveWord },
    ],
    status: 'open',
}

const useGameStore = create<GameStore>((set) => ({

    currentGame: initialGame,

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

        // z. B. E E E W W {"currentAttemptIndex": 0}
        const currentAttemptIndex = state.currentGame.currentAttempt;
        const isLastAttempt = currentAttemptIndex === state.currentGame.attempts.length - 1;
        const nextAttemptIndex = isLastAttempt ? currentAttemptIndex : currentAttemptIndex + 1;

        const nextAttempts: Attempt[] = state.currentGame.attempts.map((attempt, index) => {
            // 1. Durchlauf = 0 !== 0
            // 2. Durchlauf = 1 !== 0
            // ...
            if (index === currentAttemptIndex) {
                const nextWord: Word = {
                    ...attempt.word,
                    letters: nextLetters,
                    status: 'completed',
                    // Wann wann wird das hier gesetzt?
                    isWordChecked: true,
                };

                return {
                    ...attempt,
                    isCurrentAttempt: false,
                    word: nextWord,
                };
            }

            // Nächsten Versuch aktivieren
            if (index === nextAttemptIndex && !isLastAttempt) {
                const activatedLetters = attempt.word.letters.map((letter, letterIndex) => ({
                    ...letter,
                    isActive: letterIndex === 0,
                }));

                return {
                    ...attempt,
                    isCurrentAttempt: true,
                    word: {
                        ...attempt.word,
                        letters: activatedLetters,
                    },
                };
            }

            return attempt;
        });

        const nextCurrentWord: Word = isLastAttempt ? {
            ...state.currentWord,
            letters: nextLetters,
            status: 'completed',
            isWordChecked: true,
        } : nextAttempts[nextAttemptIndex].word;

        // Game status for win
        const gameStatus = nextLetters.every((letter) => {
            return letter.status === 'match';
        });

        return {
            currentWord: nextCurrentWord,
            currentLetter: isLastAttempt
                ? state.currentLetter
                : { ...state.currentLetter, index: 0, value: '', isActive: true },
            currentGame: {
                ...state.currentGame,
                currentAttempt: nextAttemptIndex,
                isGameFinished: isLastAttempt || state.currentGame.isGameFinished,
                attempts: nextAttempts,
                status: gameStatus === true ? 'win' : gameStatus === false && isLastAttempt ? 'lose' : 'open'
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
                ? { ...attempt, word: { ...attempt.word, letters: nextLetters, isWordChecked: allValuesSet } }
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
                isWordChecked: allValuesSet,
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
                    ? { ...attempt, word: { ...attempt.word, letters: nextLetters, isWordChecked: false } }
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
                    isWordChecked: false
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
                ? { ...attempt, word: { ...attempt.word, letters: nextLetters, isWordChecked: false } }
                : attempt,
        );

        return {
            currentLetter: { ...state.currentLetter, index: targetIndex },
            currentWord: { ...state.currentWord, letters: nextLetters, isWordChecked: false },
            currentGame: {
                ...state.currentGame,
                attempts: nextAttempts,
            },
        };
    }),

    currentWord: initialWord,

    deleteWord: () => set((state) => {
        const currentAttemptIndex = state.currentGame.currentAttempt;
        const isLastAttempt = currentAttemptIndex === state.currentGame.attempts.length - 1;

        if (isLastAttempt) {
            return {
                currentGame: {
                    ...state.currentGame,
                },
            };
        }

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

        // Wenn kein Letter active ist, dann füge keinen Buchstaben hinzu
        if (!attempt.word.letters[letterIndex].isActive) {
            return {
                currentLetter: {
                    ...state.currentLetter,
                },
                currentGame: {
                    ...state.currentGame,
                },
            };
        }

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

            // Check if the word is filled and check every letter
            const isWordFilled = nextLetters.every((letter) => {
                return letter.value !== "";
            });

            return {
                ...currentAttempt,
                word: {
                    ...currentAttempt.word,
                    letters: nextLetters,
                    // TODO: Fix typing issue with state
                    status: isWordFilled === true ? 'filled' : 'unfinished'
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