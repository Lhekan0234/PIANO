(function(){
        // --------------------------------------------------------------
        // PIANO NOTE MAPPING: 2 OCTAVES (C4 to B5) but with 14 white keys actually?
        // To get realistic piano feel with 2 octaves = range C4 -> B5 inclusive 14 white keys? 
        // Standard layout: white keys: C, D, E, F, G, A, B repeating.
        // We'll create 2 full octaves + a bonus? but let's use 2 octaves: from C4 to B5 (14 white keys + 10 black keys)
        // For simplicity compatible with keyboard mapping:  white keys mapped to row: A S D F G H J K L ; '
        // Black keys: W E (C#/D#) , T Y (F#/G#) , U O P (A#/B? careful mapping)
        // Let's design natural piano with 2 octaves starting from C4 (middle C reference)
        
        const NOTE_CONFIG = [
            // Octave 4 (C4 to B4)
            { name: "C4", type: "white", note: "C", keyCode: "KeyA", display: "A", soundFreq: 261.63 },
            { name: "C#4", type: "black", note: "C#", keyCode: "KeyW", display: "W", soundFreq: 277.18 },
            { name: "D4", type: "white", note: "D", keyCode: "KeyS", display: "S", soundFreq: 293.66 },
            { name: "D#4", type: "black", note: "D#", keyCode: "KeyE", display: "E", soundFreq: 311.13 },
            { name: "E4", type: "white", note: "E", keyCode: "KeyD", display: "D", soundFreq: 329.63 },
            { name: "F4", type: "white", note: "F", keyCode: "KeyF", display: "F", soundFreq: 349.23 },
            { name: "F#4", type: "black", note: "F#", keyCode: "KeyT", display: "T", soundFreq: 369.99 },
            { name: "G4", type: "white", note: "G", keyCode: "KeyG", display: "G", soundFreq: 392.00 },
            { name: "G#4", type: "black", note: "G#", keyCode: "KeyY", display: "Y", soundFreq: 415.30 },
            { name: "A4", type: "white", note: "A", keyCode: "KeyH", display: "H", soundFreq: 440.00 },
            { name: "A#4", type: "black", note: "A#", keyCode: "KeyU", display: "U", soundFreq: 466.16 },
            { name: "B4", type: "white", note: "B", keyCode: "KeyJ", display: "J", soundFreq: 493.88 },
            // Octave 5 (C5 to B5)
            { name: "C5", type: "white", note: "C", keyCode: "KeyK", display: "K", soundFreq: 523.25 },
            { name: "C#5", type: "black", note: "C#", keyCode: "KeyO", display: "O", soundFreq: 554.37 },
            { name: "D5", type: "white", note: "D", keyCode: "KeyL", display: "L", soundFreq: 587.33 },
            { name: "D#5", type: "black", note: "D#", keyCode: "KeyP", display: "P", soundFreq: 622.25 },
            { name: "E5", type: "white", note: "E", keyCode: "Semicolon", display: ";", soundFreq: 659.25 },
            { name: "F5", type: "white", note: "F", keyCode: "Quote", display: "'", soundFreq: 698.46 },
        ];
        
        // Additional black key after E5 normally no black key between E and F, but correct :)
        // Already includes all blacks: C#4, D#4, F#4, G#4, A#4, C#5, D#5. That's 7 black keys total, perfect.
        // White keys: C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5 = 11 white keys? but we have up to F5 = 11? Actually we have 12 white keys from C4 to F5 = C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 -> 11 white? Wait total notes length: NOTE_CONFIG length=18 (11 white + 7 black) but standard piano 2 octaves would have 24 keys! but our mapping limited to keyboard row, but it's usable and snappy.
        // I'll enhance to make full piano 2 octaves feel robust. Adding more notes to fill complete 2 octaves (C4 to B5) using extra black keys mapping? computer keyboard only so many keys, but we can keep consistent and extend white keys range with extra mapping: Use bracket? But to keep clean let's add shift? no, best is keep 2 full octaves with existing keys but I'll extend notes: add additional white and black keys without new keyboard mapping (click support only) to ensure piano looks complete.
        // But to maintain visual completeness: we generate a realistic 2-octave piano from C4 to B5. For any key without dedicated keyboard shortcut, it still works via mouse click. That's perfect.
        
        // EXTEND FULL PIANO from C4 to B5 (total 14 white keys + 10 black keys = 24 keys)
        const fullPianoNotes = [];
        // Note frequencies mapping base
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const baseFreq = (octave, semitone) => 261.63 * Math.pow(2, (octave - 4) + (semitone / 12));
        
        let keyCounter = 0;
        // keyboard mapping for natural typing: assign for most prominent keys only, others fallback to click.
        const keyboardMap = new Map();
        // pre-defined mapping: A,S,D,F,G,H,J,K,L,;,' for white keys; W,E,T,Y,U,O,P for black.
        const whiteKeyChars = ["A","S","D","F","G","H","J","K","L",";","'"];
        const blackKeyChars = ["W","E","T","Y","U","O","P"];
        let whiteIdx = 0, blackIdx = 0;
        
        for (let oct = 4; oct <= 5; oct++) {
            for (let s = 0; s < 12; s++) {
                let note = noteNames[s];
                let isBlack = note.includes("#");
                let freq = baseFreq(oct, s);
                let noteId = `${note}${oct}`;
                let keyCodeAssigned = null;
                let displayLabel = "";
                
                if (!isBlack) {
                    if (whiteIdx < whiteKeyChars.length) {
                        let rawKey = whiteKeyChars[whiteIdx];
                        displayLabel = rawKey.toUpperCase();
                        if (rawKey === ";") displayLabel = ";";
                        if (rawKey === "'") displayLabel = "'";
                        keyCodeAssigned = getKeyCodeFromChar(rawKey);
                        whiteIdx++;
                    }
                } else {
                    if (blackIdx < blackKeyChars.length) {
                        let rawKey = blackKeyChars[blackIdx];
                        displayLabel = rawKey.toUpperCase();
                        keyCodeAssigned = getKeyCodeFromChar(rawKey);
                        blackIdx++;
                    }
                }
                
                fullPianoNotes.push({
                    id: `${noteId}_${keyCounter}`,
                    name: noteId,
                    type: isBlack ? "black" : "white",
                    note: note,
                    octave: oct,
                    freq: freq,
                    keyBinding: keyCodeAssigned,
                    displayChar: displayLabel || (isBlack ? "♯" : "●")
                });
                keyCounter++;
                if (oct === 5 && s === 11) break;
            }
        }
        
        function getKeyCodeFromChar(ch) {
            if (ch === ";") return "Semicolon";
            if (ch === "'") return "Quote";
            if (ch >= "A" && ch <= "Z") return `Key${ch}`;
            return null;
        }
        
        // Audio context setup with cross-browser support
        let audioCtx = null;
        let activeOscillators = new Map();  // track note->oscillator gain to stop gracefully
        
        function initAudio() {
            if (audioCtx) return audioCtx;
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            return audioCtx;
        }
        
        function playNote(frequency, duration = 0.7) {
            if (!frequency || isNaN(frequency)) return;
            try {
                let ctx = initAudio();
                // resume if suspended (browser policy)
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';  // softer piano-like
                osc.frequency.value = frequency;
                gain.gain.value = 0.35;
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);
                osc.stop(now + duration);
                // Cleanup after finish
                osc.onended = () => {
                    osc.disconnect();
                    gain.disconnect();
                };
            } catch(e) { console.warn("audio error", e); }
        }
        
        // Visual + sound trigger
        function triggerKey(keyElement, freq, isActiveClass = true) {
            if (!keyElement) return;
            if (isActiveClass) {
                keyElement.classList.add('active');
                setTimeout(() => {
                    if (keyElement) keyElement.classList.remove('active');
                }, 140);
            }
            playNote(freq, 0.65);
        }
        
        // Build DOM piano
        const pianoContainer = document.getElementById('pianoKeyboard');
        pianoContainer.innerHTML = '';
        
        // store dom elements mapping (by id and also by key binding)
        const keyElementsMap = new Map(); // id -> dom
        const keyBindingMap = new Map();  // keyCode string -> dom element
        
        fullPianoNotes.forEach((noteData, idx) => {
            const keyDiv = document.createElement('div');
            keyDiv.className = noteData.type === 'white' ? 'white-key key' : 'black-key key';
            keyDiv.setAttribute('data-note', noteData.name);
            keyDiv.setAttribute('data-freq', noteData.freq);
            keyDiv.setAttribute('data-id', noteData.id);
            
            // Label inside
            const labelSpan = document.createElement('span');
            labelSpan.className = 'note-label';
            let displayText = noteData.note;
            if (noteData.displayChar && noteData.displayChar !== '●') {
                displayText = `${noteData.note} (${noteData.displayChar})`;
            } else if (noteData.displayChar === '●' && noteData.type === 'black') {
                displayText = `${noteData.note}`;
            } else if (noteData.type === 'white' && noteData.displayChar) {
                displayText = `${noteData.note}  ${noteData.displayChar}`;
            } else {
                displayText = noteData.note;
            }
            labelSpan.innerText = displayText;
            keyDiv.appendChild(labelSpan);
            
            // Click handler
            keyDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                const freq = parseFloat(keyDiv.getAttribute('data-freq'));
                if (!isNaN(freq)) {
                    triggerKey(keyDiv, freq, true);
                    // visual ripple
                }
            });
            
            pianoContainer.appendChild(keyDiv);
            keyElementsMap.set(noteData.id, keyDiv);
            if (noteData.keyBinding) {
                keyBindingMap.set(noteData.keyBinding, { element: keyDiv, freq: noteData.freq });
            }
        });
        
        // Also compute white/black positions by CSS order, absolutely fine
        
        // --- Keyboard Event Handler ---
        function onKeyDown(event) {
            let code = event.code;
            // ignore if modifier keys but useful
            if (event.repeat) return; // prevent retriggering while holding
            if (keyBindingMap.has(code)) {
                event.preventDefault();
                const { element, freq } = keyBindingMap.get(code);
                if (element) {
                    triggerKey(element, freq, true);
                }
            }
        }
        
        window.addEventListener('keydown', onKeyDown);
        
        // optional reset / no actual reset needed but button resets visual glows (clear active)
        const resetBtn = document.getElementById('resetActiveNotes');
        resetBtn.addEventListener('click', () => {
            // just remove any lingering active styles if any
            document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
            // optional small feedback
            const tempMsg = resetBtn.innerText;
            resetBtn.innerText = "✓ Cleared!";
            setTimeout(() => { resetBtn.innerText = tempMsg; }, 500);
        });
        
        // init audio on first user interaction (required by browsers)
        const firstUserTap = () => {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            } else if (!audioCtx) {
                initAudio().resume();
            }
            document.body.removeEventListener('click', firstUserTap);
            document.body.removeEventListener('keydown', firstUserTap);
        };
        document.body.addEventListener('click', firstUserTap);
        document.body.addEventListener('keydown', firstUserTap);
        
        // Small additional console confirm
        console.log("✅ Piano ready! Total keys:", fullPianoNotes.length, "white/black interactive");
        
        // Touch device optimizations: prevent context menu on long press
        document.querySelectorAll('.key').forEach(k => {
            k.addEventListener('contextmenu', (e) => e.preventDefault());
            k.addEventListener('touchstart', (e) => {
                // for mobile: trigger immediately
                const freq = parseFloat(k.getAttribute('data-freq'));
                if (!isNaN(freq)) {
                    triggerKey(k, freq, true);
                    e.preventDefault();
                }
            });
        });
        
        // Additional dynamic adjustment for black key overlapping margin on responsive
        // ensure nice visual stacking: Already fine.
    })();