class DotSymphony {
    constructor() {
        this.currentModule = 'language';
        this.dots = [];
        this.dictionary = [];
        this.timelineData = {};
        this.currentDate = new Date().toISOString().split('T')[0];
        this.selectedHour = null;
        this.musicTimeline = null;
        this.isPlaying = false;
        this.audioContext = null;
        this.musicCanvas = null;
        this.musicCtx = null;
        this.playbackSpeed = 1.0;
        this.currentFrame = 0;
        this.backgroundInstruments = {
            drums: { enabled: false, volume: 0.3, pattern: null },
            bass: { enabled: false, volume: 0.4, pattern: null },
            guitar: { enabled: false, volume: 0.25, pattern: null },
            ambient: { enabled: false, volume: 0.2, pattern: null }
        };
        this.backgroundOscillators = [];
        this.llmSettings = {
            provider: 'openai',
            apiKey: '',
            model: 'gpt-3.5-turbo'
        };

        // Sentiment analysis keywords
        this.sentimentMap = {
            joy:        { color: '#FFD700', shape: 'circle',  emotion: 'joy',        instruments: ['piano', 'guitar'] },
            happy:      { color: '#FFEAA7', shape: 'circle',  emotion: 'joy',        instruments: ['piano', 'bells'] },
            excited:    { color: '#FF6B6B', shape: 'triangle',emotion: 'excitement', instruments: ['synth', 'drums'] },
            calm:       { color: '#4ECDC4', shape: 'circle',  emotion: 'calm',       instruments: ['flute', 'strings'] },
            peaceful:   { color: '#B2F7EF', shape: 'circle',  emotion: 'calm',       instruments: ['harp', 'flute'] },
            anxious:    { color: '#FFA500', shape: 'square',  emotion: 'anxiety',    instruments: ['synth', 'bass'] },
            worried:    { color: '#FF8C00', shape: 'square',  emotion: 'anxiety',    instruments: ['synth', 'plucks'] },
            scared:     { color: '#E17055', shape: 'triangle',emotion: 'fear',       instruments: ['synth', 'vibes'] },
            sad:        { color: '#6495ED', shape: 'triangle',emotion: 'sadness',    instruments: ['cello', 'piano'] },
            tired:      { color: '#6C5CE7', shape: 'circle',  emotion: 'fatigue',    instruments: ['slowpad', 'piano'] },
            bored:      { color: '#D3D3D3', shape: 'square',  emotion: 'boredom',    instruments: ['bass', 'low-fi'] },
            angry:      { color: '#DC143C', shape: 'square',  emotion: 'anger',      instruments: ['drums', 'distorted'] },
            frustrated: { color: '#FF7675', shape: 'triangle',emotion: 'frustration',instruments: ['drums', 'plucks'] },
            focused:    { color: '#9370DB', shape: 'diamond', emotion: 'focus',      instruments: ['piano', 'minimal'] },
            nostalgic:  { color: '#A29BFE', shape: 'circle',  emotion: 'nostalgia',  instruments: ['vinyl', 'soft synth'] },
            motivated:  { color: '#00B894', shape: 'triangle',emotion: 'motivation', instruments: ['guitar', 'synth'] },
            grateful:   { color: '#32CD32', shape: 'circle',  emotion: 'gratitude',  instruments: ['choir', 'bells'] },
            love:       { color: '#FF69B4', shape: 'circle',  emotion: 'love',       instruments: ['strings', 'harp'] },
            hopeful:    { color: '#FAB1A0', shape: 'circle',  emotion: 'hope',       instruments: ['bells', 'flute'] },
            confused:   { color: '#A0A0A0', shape: 'square',  emotion: 'confusion',  instruments: ['random', 'atonal'] },
            overwhelmed:{ color: '#6C5CE7', shape: 'diamond', emotion: 'overwhelm',  instruments: ['ambient', 'soft drums'] },
            helpless:   { color: '#636E72', shape: 'diamond', emotion: 'helplessness', instruments: ['pad', 'minor strings'] },
            protective: { color: '#00CEC9', shape: 'square',  emotion: 'protective', instruments: ['brass', 'low pads'] },
            social:     { color: '#FDCB6E', shape: 'circle',  emotion: 'social',     instruments: ['ukulele', 'handpan'] },
            content:    { color: '#A3CB38', shape: 'circle',  emotion: 'contentment',instruments: ['guitar', 'bells'] },
            proud:      { color: '#FDCB6E', shape: 'square',  emotion: 'pride',      instruments: ['choir', 'brass'] },
            creative:   { color: '#FD79A8', shape: 'diamond', emotion: 'creativity', instruments: ['synth', 'piano'] },
            shy:        { color: '#FFE6F0', shape: 'circle',  emotion: 'shyness',    instruments: ['bells', 'light plucks'] },
            insecure:   { color: '#C0C0C0', shape: 'triangle',emotion: 'insecurity', instruments: ['bass', 'filtered synth'] },
            embarrassed:{ color: '#F48FB1', shape: 'circle',  emotion: 'embarrassment', instruments: ['staccato strings', 'toy piano'] },
            lonely:     { color: '#5D6D7E', shape: 'diamond', emotion: 'loneliness', instruments: ['violin', 'ambient'] }
        };

        // Musical scales
        this.scales = {
            major:       [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C major
            minor:       [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25], // C minor
            pentatonic:  [261.63, 293.66, 329.63, 392.00, 440.00],                         // C major pentatonic
            blues:       [261.63, 311.13, 349.23, 369.99, 392.00, 466.16],                 // C blues
            lydian:      [261.63, 293.66, 329.63, 370.00, 392.00, 440.00, 493.88],         // dreamy
            dorian:      [261.63, 293.66, 311.13, 349.23, 392.00, 440.00, 493.88],         // jazzy/soulful
            phrygian:    [261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16],         // exotic/dark
            mixolydian:  [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 466.16],         // uplifting but grounded
            chromatic:   [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88], // every semitone
            wholeTone:   [261.63, 293.66, 329.63, 370.00, 415.30, 466.16],                 // mysterious/sci-fi
            diminished:  [261.63, 293.66, 311.13, 349.23, 370.00, 415.30, 440.00, 493.88], // tension/suspense
            arabic:      [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 466.16],         // exotic
            japanese:    [261.63, 293.66, 311.13, 392.00, 415.30]                          // koto-style
    };

        this.initializeApp();
    }

    initializeApp() {
        this.initializeAudioContext();
        this.initializeEventListeners();
        this.loadStoredData();
        this.loadMusicMapping();
        this.initializeCurrentDate();
        this.updateDotPreview();
        this.renderDictionary();
        this.renderHourRing();
        this.initializeMusicCanvas();
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio context not supported');
        }
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchModule(e.target.dataset.tab);
            });
        });

        // Dot Language Composer
        document.getElementById('dot-name').addEventListener('input', () => this.updateDotPreview());
        document.getElementById('dot-color').addEventListener('change', () => this.updateDotPreview());
        document.getElementById('dot-size').addEventListener('change', () => this.updateDotPreview());
        document.getElementById('dot-shape').addEventListener('change', () => this.updateDotPreview());
        document.getElementById('dot-animation').addEventListener('change', () => this.updateDotPreview());
        document.getElementById('save-dot').addEventListener('click', () => this.saveDot());
        document.getElementById('export-dictionary').addEventListener('click', () => this.exportDictionary());
        document.getElementById('import-dictionary').addEventListener('click', () => this.importDictionary());
        document.getElementById('import-file').addEventListener('change', (e) => this.handleDictionaryImport(e));

        // Mind State Tracker
        document.getElementById('play-timeline').addEventListener('click', () => this.playTimeline());
        document.querySelectorAll('.entry-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchEntryType(e.target.dataset.type));
        });
        document.getElementById('analyze-journal').addEventListener('click', () => this.analyzeJournalEntry());
        document.getElementById('save-entry').addEventListener('click', () => this.saveTimelineEntry());
        document.getElementById('cancel-entry').addEventListener('click', () => this.cancelEntry());
        document.getElementById('export-png').addEventListener('click', () => this.exportTimelinePNG());
        //document.getElementById('export-gif').addEventListener('click', () => this.exportTimelineGIF());
        document.getElementById('export-log').addEventListener('click', () => this.exportTimelineJSON());
        document.getElementById('generate-report').addEventListener('click', () => this.generateMedicalReport());

        // Music Composer
        document.getElementById('load-timeline-range').addEventListener('click', () => this.loadTimelineRange());
        document.getElementById('import-log').addEventListener('click', () => this.importMusicLog());
        document.getElementById('import-log-file').addEventListener('change', (e) => this.handleMusicLogImport(e));
        document.getElementById('regenerate-lyrics').addEventListener('click', () => this.generateLyrics());
        document.getElementById('toggle-music').addEventListener('click', () => this.toggleMusicSymphony());
        document.getElementById('export-midi').addEventListener('click', () => this.exportMIDI());
        document.getElementById('export-sheet').addEventListener('click', () => this.exportSheet());
        document.getElementById('export-video').addEventListener('click', () => this.exportVideo());
        
        // Speed and instrument controls
        document.getElementById('speed-slider').addEventListener('input', (e) => this.updatePlaybackSpeed(e.target.value));
        document.querySelectorAll('.instrument-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.toggleBackgroundInstrument(e.target.dataset.instrument, e.target.checked));
        });
        document.querySelectorAll('.instrument-volume').forEach(slider => {
            slider.addEventListener('input', (e) => this.updateInstrumentVolume(e.target.dataset.instrument, e.target.value));
        });

        // Menu and Settings
        document.getElementById('menu-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdownMenu();
        });
        document.getElementById('open-settings').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('open-documentation').addEventListener('click', () => this.openDocumentationModal());
        document.getElementById('open-terms').addEventListener('click', () => this.openTermsModal());
        document.getElementById('open-privacy').addEventListener('click', () => this.openPrivacyModal());
        document.getElementById('close-settings').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('close-documentation').addEventListener('click', () => this.closeDocumentationModal());
        document.getElementById('close-terms').addEventListener('click', () => this.closeTermsModal());
        document.getElementById('close-privacy').addEventListener('click', () => this.closePrivacyModal());
        document.getElementById('theme-select').addEventListener('change', (e) => this.changeTheme(e.target.value));
        document.getElementById('llm-provider').addEventListener('change', (e) => this.updateLLMProvider(e.target.value));
        document.getElementById('llm-api-key').addEventListener('input', (e) => this.updateLLMApiKey(e.target.value));
        document.getElementById('llm-model').addEventListener('change', (e) => this.updateLLMModel(e.target.value));
        document.getElementById('reset-all').addEventListener('click', () => this.resetAllData());
        document.getElementById('export-all').addEventListener('click', () => this.exportAllData());

        // Auto-expand modal
        document.getElementById('accept-suggestion').addEventListener('click', () => this.acceptSuggestion());
        document.getElementById('edit-suggestion').addEventListener('click', () => this.editSuggestion());
        document.getElementById('reject-suggestion').addEventListener('click', () => this.rejectSuggestion());

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    loadStoredData() {
        try {
            const storedDictionary = localStorage.getItem('dot-symphony-dictionary');
            if (storedDictionary && storedDictionary !== 'null') {
                const parsed = JSON.parse(storedDictionary);
                if (Array.isArray(parsed)) {
                    this.dictionary = parsed;
                }
            }

            const storedTimeline = localStorage.getItem('dot-symphony-timeline');
            if (storedTimeline && storedTimeline !== 'null') {
                const parsed = JSON.parse(storedTimeline);
                if (typeof parsed === 'object' && parsed !== null) {
                    this.timelineData = parsed;
                }
            }

            const storedLLMSettings = localStorage.getItem('dot-symphony-llm-settings');
            if (storedLLMSettings && storedLLMSettings !== 'null') {
                const parsed = JSON.parse(storedLLMSettings);
                if (typeof parsed === 'object' && parsed !== null) {
                    this.llmSettings = { ...this.llmSettings, ...parsed };
                }
            }
            
            // Always update UI after loading
            setTimeout(() => {
                this.updateLLMSettingsUI();
            }, 100);
            
        } catch (e) {
            console.warn('Error loading stored data:', e);
            // Reset corrupted data
            localStorage.removeItem('dot-symphony-dictionary');
            localStorage.removeItem('dot-symphony-timeline');
            localStorage.removeItem('dot-symphony-llm-settings');
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('dot-symphony-dictionary', JSON.stringify(this.dictionary));
            localStorage.setItem('dot-symphony-timeline', JSON.stringify(this.timelineData));
            localStorage.setItem('dot-symphony-llm-settings', JSON.stringify(this.llmSettings));
        } catch (e) {
            console.warn('Error saving to storage:', e);
        }
    }

    switchModule(module) {
        // Update navigation
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${module}"]`).classList.add('active');

        // Update modules
        document.querySelectorAll('.module').forEach(mod => mod.classList.remove('active'));
        document.getElementById(`${module}-module`).classList.add('active');

        this.currentModule = module;

        // Module-specific initialization
        if (module === 'tracker') {
            this.initializeCurrentDate();
            this.renderHourRing();
        } else if (module === 'music') {
            this.initializeMusicCanvas();
        }
    }

    // DOT LANGUAGE COMPOSER METHODS
    updateDotPreview() {
        const preview = document.getElementById('dot-preview');
        const name = document.getElementById('dot-name').value || 'Preview';
        const color = document.getElementById('dot-color').value;
        const size = document.getElementById('dot-size').value;
        const shape = document.getElementById('dot-shape').value;
        const animation = document.getElementById('dot-animation').value;

        const sizeMap = { small: 20, medium: 30, large: 40 };
        const dotSize = sizeMap[size];

        preview.innerHTML = '';
        const dotElement = this.createDotElement({
            name, color, size, shape, animation
        }, dotSize);

        preview.appendChild(dotElement);
    }

    createDotElement(dot, size = 30) {
        const element = document.createElement('div');

        if (!dot) {
            // Return empty element if dot is null/undefined
            element.style.width = size + 'px';
            element.style.height = size + 'px';
            element.style.backgroundColor = '#ccc';
            element.style.borderRadius = '50%';
            element.textContent = '●';
            return element;
        }

        element.className = 'dot-visual ' + (dot.animation ? 'dot-' + dot.animation : '');
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.backgroundColor = dot.color || '#4ecdc4';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.color = 'white';
        element.style.fontWeight = 'bold';
        element.style.fontSize = (size * 0.4) + 'px';

        // Apply shape
        switch (dot.shape) {
            case 'circle':
                element.style.borderRadius = '50%';
                break;
            case 'square':
                element.style.borderRadius = '10%';
                break;
            case 'triangle':
                element.style.borderRadius = '0';
                element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                break;
            case 'diamond':
                element.style.borderRadius = '0';
                element.style.transform = 'rotate(45deg)';
                break;
            default:
                element.style.borderRadius = '50%';
                break;
        }

        element.textContent = dot.name ? dot.name.charAt(0).toUpperCase() : '●';
        return element;
    }

    saveDot() {
        const name = document.getElementById('dot-name').value.trim();
        if (!name) {
            alert('Please enter a name for your dot');
            return;
        }

        const dot = {
            id: Date.now(),
            name: name,
            description: document.getElementById('dot-description').value.trim(),
            color: document.getElementById('dot-color').value,
            size: document.getElementById('dot-size').value,
            shape: document.getElementById('dot-shape').value,
            animation: document.getElementById('dot-animation').value,
            created: new Date().toISOString()
        };

        // Check for duplicates
        const existing = this.dictionary.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            if (confirm('A dot with this name already exists. Replace it?')) {
                const index = this.dictionary.indexOf(existing);
                this.dictionary[index] = dot;
            } else {
                return;
            }
        } else {
            this.dictionary.push(dot);
        }

        this.saveToStorage();
        this.renderDictionary();
        this.clearDotForm();
        alert('Dot saved successfully!');
    }

    clearDotForm() {
        document.getElementById('dot-name').value = '';
        document.getElementById('dot-description').value = '';
        document.getElementById('dot-color').value = '#4ecdc4';
        document.getElementById('dot-size').value = 'medium';
        document.getElementById('dot-shape').value = 'circle';
        document.getElementById('dot-animation').value = 'pulse';
        this.updateDotPreview();
    }

    renderDictionary() {
        const grid = document.getElementById('dot-grid');
        grid.innerHTML = '';

        if (this.dictionary.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">No dots created yet. Create your first dot above!</p>';
            return;
        }

        this.dictionary.forEach(dot => {
            const item = document.createElement('div');
            item.className = 'dot-item';
            item.innerHTML = `
                <div class="dot-visual">${this.createDotElement(dot, 60).outerHTML}</div>
                <div class="dot-name">${dot.name}</div>
                <div class="dot-description">${dot.description || ''}</div>
                <div class="dot-actions" style="margin-top: 10px;">
                    <button onclick="dotSymphony.editDot(${dot.id})" class="btn-small" style="margin-right: 5px; margin-bottom: 10px; padding: 5px 10px; font-size: 0.8rem;">Edit</button>
                    <button onclick="dotSymphony.deleteDot(${dot.id})" class="btn-small btn-danger" style="padding: 5px 10px; font-size: 0.8rem;">Delete</button>
                </div>
            `;
            grid.appendChild(item);
        });
    }

    editDot(id) {
        const dot = this.dictionary.find(d => d.id === id);
        if (!dot) return;

        document.getElementById('dot-name').value = dot.name;
        document.getElementById('dot-description').value = dot.description || '';
        document.getElementById('dot-color').value = dot.color;
        document.getElementById('dot-size').value = dot.size;
        document.getElementById('dot-shape').value = dot.shape;
        document.getElementById('dot-animation').value = dot.animation;
        this.updateDotPreview();

        // Remove the dot so it can be re-saved
        this.dictionary = this.dictionary.filter(d => d.id !== id);
        this.renderDictionary();
    }

    deleteDot(id) {
        if (confirm('Are you sure you want to delete this dot?')) {
            this.dictionary = this.dictionary.filter(d => d.id !== id);
            this.saveToStorage();
            this.renderDictionary();
        }
    }

    exportDictionary() {
        const data = {
            dictionary: this.dictionary,
            exported: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dot-dictionary-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importDictionary() {
        document.getElementById('import-file').click();
    }

    handleDictionaryImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.dictionary && Array.isArray(data.dictionary)) {
                    if (confirm('This will replace your current dictionary. Continue?')) {
                        this.dictionary = data.dictionary;
                        this.saveToStorage();
                        this.renderDictionary();
                        alert('Dictionary imported successfully!');
                    }
                } else {
                    alert('Invalid dictionary file format');
                }
            } catch (err) {
                alert('Error reading file: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    // MIND STATE TRACKER METHODS
    initializeCurrentDate() {
        const datePicker = document.getElementById('date-picker');
        datePicker.value = this.currentDate;
        document.getElementById('current-date').textContent = this.formatDate(this.currentDate);

        datePicker.addEventListener('change', (e) => {
            this.currentDate = e.target.value;
            document.getElementById('current-date').textContent = this.formatDate(this.currentDate);
            this.renderHourRing();
            this.cancelEntry(); // Close entry panel if open
        });
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    renderHourRing() {
        const ring = document.getElementById('hour-ring');
        ring.innerHTML = '';

        // Get the actual size of the consciousness clock for responsive positioning
        const clockElement = document.querySelector('.consciousness-clock');
        const clockSize = clockElement ? clockElement.offsetWidth : 400;
        const centerPoint = clockSize / 2;
        const radius = (clockSize * 0.42); // 42% of clock size for better mobile fit
        const markerSize = Math.max(25, Math.min(50, clockSize * 0.125)); // Responsive marker size

        for (let hour = 0; hour < 24; hour++) {
            const marker = document.createElement('div');
            marker.className = 'hour-marker';
            marker.dataset.hour = hour;

            // Position around the circle
            const angle = (hour * 15) - 90; // 15 degrees per hour, start at top
            const x = Math.cos(angle * Math.PI / 180) * radius + centerPoint;
            const y = Math.sin(angle * Math.PI / 180) * radius + centerPoint;

            marker.style.left = `${x - (markerSize / 2)}px`;
            marker.style.top = `${y - (markerSize / 2)}px`;
            marker.style.width = `${markerSize}px`;
            marker.style.height = `${markerSize}px`;
            marker.style.position = 'absolute';

            // Check if this hour has an entry
            const hasEntry = this.timelineData[this.currentDate] && this.timelineData[this.currentDate][hour];
            if (hasEntry && hasEntry.dot) {
                marker.classList.add('has-entry');
                const dot = hasEntry.dot;
                const dotElement = this.createDotElement(dot, 25);
                marker.appendChild(dotElement);
            } else {
                marker.innerHTML = `<div class="hour-dot">${hour}</div>`;
            }

            marker.addEventListener('click', () => this.openEntryPanel(hour));
            ring.appendChild(marker);
        }
    }

    openEntryPanel(hour) {
        this.selectedHour = hour;
        document.getElementById('selected-hour').textContent = `${hour}:00`;

        // Clear previous input
        document.getElementById('journal-text').value = '';
        document.getElementById('analyzed-dots').innerHTML = '';
        document.querySelectorAll('.selectable-dot').forEach(el => el.classList.remove('selected'));

        // Show available dots
        this.renderAvailableDots();

        // Load existing entry if any
        const existing = this.timelineData[this.currentDate] && this.timelineData[this.currentDate][hour];
        if (existing) {
            document.getElementById('journal-text').value = existing.journal || '';
            if (existing.dot) {
                setTimeout(() => {
                    const dotElement = document.querySelector(`[data-dot-id="${existing.dot.id}"]`);
                    if (dotElement) {
                        dotElement.classList.add('selected');
                    }
                }, 100);
            }
        }

        // Add delete button if editing an existing entry
        let deleteButton = document.getElementById('delete-entry');
        if (existing && !deleteButton) {
            deleteButton = document.createElement('button');
            deleteButton.id = 'delete-entry';
            //deleteButton.style = 'flex';
            deleteButton.textContent = 'Delete Entry';
            deleteButton.className = 'btn btn-danger';
            deleteButton.style.marginTop = '10px';
            deleteButton.addEventListener('click', () => this.deleteTimelineEntry());

            document.getElementById('entry-panel').appendChild(deleteButton);
        } else if (!existing && deleteButton) {
            // Remove delete button if not editing an existing entry
            deleteButton.remove();
            //deleteButton.style.display.none:
        }

        document.getElementById('entry-panel').style.display = 'block';
    }

    renderAvailableDots() {
        const container = document.getElementById('available-dots');
        container.innerHTML = '';

        if (this.dictionary.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">No dots available. Create some in the Dot Language Composer first.</p>';
            return;
        }

        this.dictionary.forEach(dot => {
            const element = document.createElement('div');
            element.className = 'selectable-dot';
            element.dataset.dotId = dot.id;
            element.innerHTML = `
                ${this.createDotElement(dot, 40).outerHTML}
                <div style="margin-top: 5px; font-size: 0.8rem;">${dot.name}</div>
            `;

            element.addEventListener('click', () => {
                document.querySelectorAll('.selectable-dot').forEach(el => el.classList.remove('selected'));
                element.classList.add('selected');
            });

            container.appendChild(element);
        });
    }

    switchEntryType(type) {
        document.querySelectorAll('.entry-type-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');

        if (type === 'dot') {
            document.getElementById('dot-selection').style.display = 'block';
            document.getElementById('journal-input').style.display = 'none';
        } else {
            document.getElementById('dot-selection').style.display = 'none';
            document.getElementById('journal-input').style.display = 'block';
        }
    }

    async analyzeJournalEntry() {
        const text = document.getElementById('journal-text').value.trim();
        if (!text) return;

        const container = document.getElementById('analyzed-dots');
        
        // Show LLM status with better user feedback
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            this.showLLMStatus('🧠 LLM Integration: Analyzing emotions with AI...', 'info');
            container.innerHTML = `
                <div style="padding: 15px; background: rgba(78, 205, 196, 0.1); border-radius: 10px; border: 1px solid var(--primary-color); margin-bottom: 15px;">
                    <p style="color: #4ecdc4; margin: 0; font-weight: bold;">🤖 LLM Integration Active</p>
                    <p style="color: white; margin: 5px 0 0 0; font-size: 0.9em;">AI is analyzing your journal entry for comprehensive emotion detection...</p>
                </div>
            `;
        } else {
            this.showLLMStatus('📝 Using built-in patterns (LLM not configured)', 'warning');
            container.innerHTML = `
                <div style="padding: 15px; background: rgba(255, 234, 167, 0.1); border-radius: 10px; border: 1px solid var(--warning-color); margin-bottom: 15px;">
                    <p style="color: #ffeaa7; margin: 0; font-weight: bold;">📝 Template Mode Active</p>
                    <p style="color: white; margin: 5px 0 0 0; font-size: 0.9em;">Using built-in emotion patterns. Configure LLM in settings for enhanced AI analysis.</p>
                </div>
            `;
        }

        // Enhanced text analysis for better emotion detection
        const words = text.toLowerCase().split(/[\s,.\-!?;:()]+/);
        const analyzedDots = [];
        const newKeywords = [];
        const emotionClusters = new Set();

        // More sophisticated emotion detection
        const emotionPatterns = {
            happy:       { pattern: /happy|joy|cheer|delight/,            suggestion: { color: '#FFD93D', shape: 'circle', emotion: 'happy' } },
            grateful:    { pattern: /grate|thank|appreciat/,              suggestion: { color: '#F9A825', shape: 'circle', emotion: 'grateful' } },
            hopeful:     { pattern: /hope|optimis|positive|bright/,       suggestion: { color: '#A8E6CF', shape: 'circle', emotion: 'hopeful' } },
            proud:       { pattern: /proud|accomplish|achiev/,            suggestion: { color: '#FF7F50', shape: 'triangle', emotion: 'proud' } },
            excited:     { pattern: /excit|thrill|energetic|pump/,        suggestion: { color: '#FF9F1C', shape: 'circle', emotion: 'excited' } },
            inspired:    { pattern: /inspir|aspire|uplift/,               suggestion: { color: '#FFB6B9', shape: 'circle', emotion: 'inspired' } },
            motivated:   { pattern: /motivat|determin|driven/,            suggestion: { color: '#00B894', shape: 'triangle', emotion: 'motivated' } },
            content:     { pattern: /content|satisf|fulfill|complete/,    suggestion: { color: '#C3F584', shape: 'circle', emotion: 'content' } },
            creative:    { pattern: /creativ|imaginat|artistic/,          suggestion: { color: '#FD79A8', shape: 'diamond', emotion: 'creative' } },
            social:      { pattern: /social|connect|friend|together/,     suggestion: { color: '#FDCB6E', shape: 'circle', emotion: 'social' } },
            peaceful:    { pattern: /peace|calm|relax/,                   suggestion: { color: '#B2F7EF', shape: 'circle', emotion: 'peaceful' } },
            nostalgic:   { pattern: /nostalgi|remember|past|memory/,      suggestion: { color: '#A29BFE', shape: 'circle', emotion: 'nostalgic' } },
            curious:     { pattern: /curious|interest|explor/,            suggestion: { color: '#81C3D7', shape: 'triangle', emotion: 'curious' } },
            protective:  { pattern: /protect|guard|defend/,               suggestion: { color: '#4DD599', shape: 'diamond', emotion: 'protective' } },
            sad:         { pattern: /sad|unhappy|down|blue/,              suggestion: { color: '#4A6FA5', shape: 'square', emotion: 'sad' } },
            anxious:     { pattern: /anxi|nervous|uneasy/,                 suggestion: { color: '#A66CFF', shape: 'square', emotion: 'anxious' } },
            scared:      { pattern: /scare|afraid|fear/,                  suggestion: { color: '#6A0572', shape: 'square', emotion: 'scared' } },
            frustrated:  { pattern: /frustrat|annoy|irritat|bother/,      suggestion: { color: '#B23A48', shape: 'square', emotion: 'frustrated' } },
            helpless:    { pattern: /helpless|powerless|stuck/,           suggestion: { color: '#5F0F40', shape: 'square', emotion: 'helpless' } },
            overwhelmed: { pattern: /overwhelm|flooded|overload/,         suggestion: { color: '#5F0F40', shape: 'hexagon', emotion: 'overwhelmed' } },
            stressed:    { pattern: /stress|tense|pressure|strain/,       suggestion: { color: '#FF6B6B', shape: 'hexagon', emotion: 'stressed' } },
            ashamed:     { pattern: /ashamed|embarrass|regret/,           suggestion: { color: '#A4133C', shape: 'hexagon', emotion: 'ashamed' } },
            tired:       { pattern: /tired|exhaust|drain|weary|fatigue/,  suggestion: { color: '#6C5CE7', shape: 'circle', emotion: 'tired' } },
            bored:       { pattern: /bored|dull|apathetic/,               suggestion: { color: '#9E9E9E', shape: 'square', emotion: 'bored' } },
            lonely:      { pattern: /lonely|alone|isolat/,                suggestion: { color: '#264653', shape: 'square', emotion: 'lonely' } },
            insecure:    { pattern: /insecure|doubt|worthless/,           suggestion: { color: '#7D5A5A', shape: 'square', emotion: 'insecure' } },
            guilty:      { pattern: /guilt|remorse|blame/,                suggestion: { color: '#6E5773', shape: 'square', emotion: 'guilty' } },
            rejected:    { pattern: /reject|excluded|abandon/,            suggestion: { color: '#5A3E36', shape: 'square', emotion: 'rejected' } },
            confused:    { pattern: /confus|unclear|lost/,                suggestion: { color: '#B497BD', shape: 'diamond', emotion: 'confused' } },
            calm:        { pattern: /calm|zen|still/,                     suggestion: { color: '#A3E4D7', shape: 'circle', emotion: 'calm' } }
};

        // Check for existing dots
        words.forEach(word => {
            const cleaned = word.replace(/[^\w]/g, '');
            const existingDot = this.dictionary.find(d => 
                d.name.toLowerCase() === cleaned || 
                (d.description && d.description.toLowerCase().includes(cleaned))
            );

            if (existingDot && !analyzedDots.find(d => d.id === existingDot.id)) {
                analyzedDots.push(existingDot);
            }
        });

        // Enhanced pattern matching for emotions
        const fullText = text.toLowerCase();

        // Check sentiment map first
        Object.keys(this.sentimentMap).forEach(emotion => {
            if (fullText.includes(emotion) && !this.dictionary.find(d => d.name.toLowerCase() === emotion)) {
                emotionClusters.add(emotion);
                newKeywords.push({
                    word: emotion,
                    suggestion: this.sentimentMap[emotion],
                    confidence: 'high'
                });
            }
        });

        // Check advanced emotion patterns
        Object.entries(emotionPatterns).forEach(([emotion, data]) => {
            if (data.pattern.test(fullText) && !this.dictionary.find(d => d.name.toLowerCase() === emotion)) {
                if (!emotionClusters.has(emotion)) {
                    emotionClusters.add(emotion);
                    newKeywords.push({
                        word: emotion,
                        suggestion: data.suggestion,
                        confidence: 'medium'
                    });
                }
            }
        });

        // Try LLM analysis if API key is provided
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            try {
                const llmResult = await this.analyzeLLM(text);
                if (llmResult && llmResult.emotions) {
                    this.showLLMStatus('✅ AI analysis complete!', 'success');
                    llmResult.emotions.forEach(emotion => {
                        const emotionLower = emotion.toLowerCase().trim();
                        if (emotionLower && !emotionClusters.has(emotionLower) && !this.dictionary.find(d => d.name.toLowerCase() === emotionLower)) {
                            emotionClusters.add(emotionLower);
                            const suggestion = this.sentimentMap[emotionLower] || {
                                color: this.getColorFromEmotion(emotionLower), //generateRandomColor(),
                                shape: this.getShapeFromEmotion(emotionLower),    //getRandomShape(),
                                emotion: emotionLower
                            };
                            newKeywords.push({
                                word: emotionLower,
                                suggestion: suggestion,
                                confidence: 'llm'
                            });
                        }
                    });
                } else {
                    this.showLLMStatus('⚠️ AI analysis incomplete, using patterns', 'warning');
                }
            } catch (error) {
                console.warn('LLM analysis failed, using fallback:', error);
                this.showLLMStatus('❌ AI analysis failed, using built-in patterns', 'error');
            }
        }

        // Display analyzed dots
        container.innerHTML = '';

        // Show existing dots found
        if (analyzedDots.length > 0) {
            const existingHeader = document.createElement('p');
            existingHeader.style.color = '#4ecdc4';
            existingHeader.style.fontWeight = 'bold';
            existingHeader.style.marginBottom = '10px';
            existingHeader.textContent = 'Found in your dictionary (click to select):';
            container.appendChild(existingHeader);

            analyzedDots.forEach(dot => {
                const element = document.createElement('div');
                element.className = 'analyzed-dot selectable-dot';
                element.dataset.dotId = dot.id;
                element.style.cursor = 'pointer';
                element.style.border = '2px solid transparent';
                element.style.transition = 'all 0.3s ease';
                element.innerHTML = `
                    ${this.createDotElement(dot, 20).outerHTML}
                    <span>${dot.name}</span>
                `;

                // Make existing dots selectable
                element.addEventListener('click', () => {
                    document.querySelectorAll('.selectable-dot').forEach(el => el.classList.remove('selected'));
                    element.classList.add('selected');
                    element.style.border = '2px solid var(--primary-color)';
                    element.style.background = 'rgba(78, 205, 196, 0.2)';
                });

                container.appendChild(element);
            });
        }

        // Create new dots automatically
        if (newKeywords.length > 0) {
            let createdCount = 0;

            const newHeader = document.createElement('p');
            newHeader.style.color = '#96ceb4';
            newHeader.style.fontWeight = 'bold';
            newHeader.style.marginTop = '15px';
            newHeader.style.marginBottom = '10px';
            newHeader.textContent = 'New emotions detected and added (click to select):';
            container.appendChild(newHeader);

            newKeywords.forEach(keywordData => {
                const newDot = {
                    id: Date.now() + createdCount,
                    name: keywordData.word.charAt(0).toUpperCase() + keywordData.word.slice(1),
                    description: `Auto-generated from journal analysis (${keywordData.confidence} confidence)`,
                    color: keywordData.suggestion.color,
                    size: 'medium',
                    shape: keywordData.suggestion.shape || 'circle',
                    animation: 'pulse',
                    created: new Date().toISOString()
                };

                this.dictionary.push(newDot);
                analyzedDots.push(newDot); // Add to analyzed dots for potential selection
                createdCount++;

                // Add to display
                const element = document.createElement('div');
                element.className = 'analyzed-dot selectable-dot';
                element.dataset.dotId = newDot.id;
                element.style.border = '2px solid var(--success-color)';
                element.style.cursor = 'pointer';
                element.style.transition = 'all 0.3s ease';
                element.innerHTML = `
                    ${this.createDotElement(newDot, 20).outerHTML}
                    <span>${newDot.name} (new!)</span>
                `;

                // Make it selectable
                element.addEventListener('click', () => {
                    document.querySelectorAll('.selectable-dot').forEach(el => el.classList.remove('selected'));
                    element.classList.add('selected');
                    element.style.border = '2px solid var(--primary-color)';
                    element.style.background = 'rgba(78, 205, 196, 0.2)';
                });

                container.appendChild(element);
            });

            // Save to storage and refresh UI
            this.saveToStorage();
            this.renderDictionary();

            // Force refresh of available dots to include new ones
            setTimeout(() => {
                this.renderAvailableDots();
            }, 100);

            const message = document.createElement('p');
            message.style.color = '#4ecdc4';
            message.style.marginTop = '10px';
            message.style.fontStyle = 'italic';
            message.textContent = '✨ Created ' + createdCount + ' new dot' + (createdCount > 1 ? 's' : '') + ' for your emotional vocabulary!';
            container.appendChild(message);
        }

        if (analyzedDots.length === 0 && newKeywords.length === 0) {
            container.innerHTML = '<p style="color: #ffa500;">No clear emotions detected. Try using more descriptive emotional words or phrases describing how you feel.</p>';
        }

        // Add instruction for dot selection
        if (analyzedDots.length > 0 || newKeywords.length > 0) {
            const instruction = document.createElement('p');
            instruction.style.color = '#ffeaa7';
            instruction.style.marginTop = '15px';
            instruction.style.fontWeight = 'bold';
            instruction.style.textAlign = 'center';
            instruction.textContent = '👆 Click on a dot above to select it for your timeline entry';
            container.appendChild(instruction);
        }
    }

    deleteTimelineEntry() {
        if (this.selectedHour === null) return;

        if (confirm('Are you sure you want to delete this entry?')) {
            if (this.timelineData[this.currentDate] && this.timelineData[this.currentDate][this.selectedHour]) {
                delete this.timelineData[this.currentDate][this.selectedHour];
                this.saveToStorage();
                this.renderHourRing();
                this.cancelEntry();
                alert('Entry deleted successfully!');            }
        }
    }

    generateRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomShape() {
        const shapes = ['circle', 'square', 'triangle', 'diamond'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    getColorFromEmotion(emotion) {
    const emotionColorMap = {
        happy: '#FFD93D',        // bright yellow
        sad: '#4A6FA5',          // dark blue
        angry: '#D72638',        // intense red
        afraid: '#6A0572',       // dark purple
        surprised: '#FFB84C',    // orange-yellow
        disgusted: '#607D3B',    // olive green
        proud: '#FF7F50',        // coral
        content: '#C3F584',      // soft green
        frustrated: '#B23A48',   // muted red
        anxious: '#A66CFF',      // lavender
        hopeful: '#A8E6CF',      // mint green
        grateful: '#F9A825',     // golden
        jealous: '#6A994E',      // moss green
        peaceful: '#B2F7EF',     // very light blue
        excited: '#FF9F1C',      // vivid orange
        embarrassed: '#F1948A',  // light red
        confused: '#B497BD',     // mauve
        bored: '#9E9E9E',        // gray
        ashamed: '#A4133C',      // wine red
        guilty: '#6E5773',       // dull violet
        curious: '#81C3D7',      // sky blue
        overwhelmed: '#5F0F40',  // deep plum
        insecure: '#7D5A5A',     // dull brown
        confident: '#50C878',    // emerald green
        nostalgic: '#FFBCBC',    // soft pink
        inspired: '#FFB6B9',     // warm pink
        rejected: '#5A3E36',     // muted brown
        lonely: '#264653',       // deep teal
        relieved: '#B8E1FF',     // icy blue
        protective: '#4DD599'    // calm green
    };

    return emotionColorMap[emotion] || '#CCCCCC'; // fallback color (gray) if emotion not found
    }

    getShapeFromEmotion(emotion) {
    const emotionScores = {
        happy: { good: 10, bad: 0 },
        sad: { good: 0, bad: 9 },
        angry: { good: 0, bad: 10 },
        afraid: { good: 0, bad: 9 },
        surprised: { good: 6, bad: 4 },
        disgusted: { good: 1, bad: 8 },
        proud: { good: 8, bad: 1 },
        content: { good: 9, bad: 0 },
        frustrated: { good: 0, bad: 7 },
        anxious: { good: 0, bad: 8 },
        hopeful: { good: 8, bad: 1 },
        grateful: { good: 9, bad: 0 },
        jealous: { good: 1, bad: 9 },
        peaceful: { good: 10, bad: 0 },
        excited: { good: 9, bad: 1 },
        embarrassed: { good: 2, bad: 6 },
        confused: { good: 2, bad: 7 },
        bored: { good: 1, bad: 5 },
        ashamed: { good: 0, bad: 9 },
        guilty: { good: 1, bad: 8 },
        curious: { good: 7, bad: 1 },
        overwhelmed: { good: 1, bad: 8 },
        insecure: { good: 0, bad: 9 },
        confident: { good: 9, bad: 0 },
        nostalgic: { good: 6, bad: 3 },
        inspired: { good: 9, bad: 1 },
        rejected: { good: 0, bad: 9 },
        lonely: { good: 0, bad: 8 },
        relieved: { good: 8, bad: 2 },
        protective: { good: 7, bad: 2 }
    };

    const shapes = ['circle', 'diamond', 'triangle', 'square', 'star']; // increasing edges
    const badScore = emotionScores[emotion]?.bad;

    if (badScore === undefined) return 'circle'; // fallback shape

    if (badScore <= 1) return shapes[0];      // circle
    if (badScore <= 3) return shapes[1];      // diamond
    if (badScore <= 6) return shapes[2];      // triangle
    if (badScore <= 8) return shapes[3];      // square
    return shapes[4];                         // star
    }

    async generateLLMSoundMapping(dot) {
        if (!this.llmSettings.apiKey) return null;

        const prompt = `Create an optimal sound mapping for an emotional dot using cobordism and homotopy mathematical concepts.

Dot Information:
- Name: ${dot.name}
- Color: ${dot.color}
- Shape: ${dot.shape}
- Description: ${dot.description || 'N/A'}

Mathematical Framework:
- Cobordism: Smooth transitions between emotional states in musical space
- Homotopy: Continuous deformation preserving emotional essence

Requirements:
1. Choose instrument that best represents this emotion
2. Select musical scale that aligns with emotional tone
3. Determine optimal volume (0-100) for emotional impact
4. Set note duration for proper emotional expression
5. Consider mathematical continuity with other emotions

Available instruments: piano, guitar, synth, flute, strings, drums, bass, bells, harp
Available scales: major (bright/happy), minor (sad/dark), pentatonic (calm/eastern), blues (soulful/expressive)

Do not say anything and just return this JSON format:
{
  "instrument": "chosen_instrument",
  "scale": "chosen_scale",
  "volume": 75,
  "noteLength": "half",
  "reasoning": "Brief explanation of choices based on emotional and mathematical considerations"
}`;

        try {
            const result = await this.generateLLMContent(prompt);
            if (result && result.instrument && result.scale) {
                return {
                    instrument: result.instrument,
                    scale: result.scale,
                    volume: result.volume || 70,
                    noteLength: result.noteLength || 'half',
                    baseFrequency: this.getBaseFrequencyFromDot(dot),
                    llmGenerated: true,
                    reasoning: result.reasoning
                };
            }
        } catch (error) {
            console.warn('LLM sound mapping generation failed:', error);
        }
        return null;
    }

    generateTemplateSoundMapping(dot) {
        const emotion = this.getEmotionFromDot(dot);
        const instruments = this.sentimentMap[emotion]?.instruments || ['piano'];
        const scale = this.getScaleFromEmotion(emotion);
        
        // Enhanced template mapping with better emotional intelligence
        const emotionMappings = {
            joy:         { instrument: 'bells',     scale: 'major',     volume: 85, noteLength: 'quarter' },
            happy:       { instrument: 'piano',     scale: 'major',     volume: 80, noteLength: 'half' },
            excited:     { instrument: 'synth',     scale: 'major',     volume: 90, noteLength: 'eighth' },
            hopeful:     { instrument: 'violin',    scale: 'major',     volume: 75, noteLength: 'half' },
            proud:       { instrument: 'trumpet',   scale: 'major',     volume: 85, noteLength: 'quarter' },
            motivated:   { instrument: 'guitar',    scale: 'major',     volume: 85, noteLength: 'quarter' },
            inspired:    { instrument: 'violin',    scale: 'major',     volume: 80, noteLength: 'half' },
            grateful:    { instrument: 'harp',      scale: 'pentatonic',volume: 70, noteLength: 'half' },
            calm:        { instrument: 'flute',     scale: 'pentatonic',volume: 60, noteLength: 'whole' },
            peaceful:    { instrument: 'harp',      scale: 'pentatonic',volume: 55, noteLength: 'whole' },
            content:     { instrument: 'acoustic',  scale: 'major',     volume: 65, noteLength: 'whole' },
            social:      { instrument: 'marimba',   scale: 'major',     volume: 75, noteLength: 'quarter' },
            curious:     { instrument: 'xylophone', scale: 'lydian',     volume: 70, noteLength: 'eighth' },
            creative:    { instrument: 'electric piano', scale: 'dorian', volume: 80, noteLength: 'eighth' },
            nostalgic:   { instrument: 'music box', scale: 'minor',     volume: 60, noteLength: 'half' },
            sad:         { instrument: 'strings',   scale: 'minor',     volume: 65, noteLength: 'whole' },
            anxious:     { instrument: 'synth',     scale: 'minor',     volume: 75, noteLength: 'sixteenth' },
            scared:      { instrument: 'viola',     scale: 'minor',     volume: 80, noteLength: 'eighth' },
            angry:       { instrument: 'drums',     scale: 'blues',     volume: 95, noteLength: 'quarter' },
            frustrated:  { instrument: 'bass',      scale: 'blues',     volume: 90, noteLength: 'eighth' },
            overwhelmed: { instrument: 'organ',     scale: 'minor',     volume: 88, noteLength: 'sixteenth' },
            helpless:    { instrument: 'cello',     scale: 'minor',     volume: 60, noteLength: 'whole' },
            stressed:    { instrument: 'drum kit',  scale: 'minor',     volume: 85, noteLength: 'eighth' },
            ashamed:     { instrument: 'low synth', scale: 'phrygian',  volume: 65, noteLength: 'whole' },
            tired:       { instrument: 'pad',       scale: 'minor',     volume: 55, noteLength: 'whole' },
            lonely:      { instrument: 'cello',     scale: 'minor',     volume: 60, noteLength: 'whole' },
            bored:       { instrument: 'organ',     scale: 'minor',     volume: 50, noteLength: 'whole' },
            insecure:    { instrument: 'bass synth',scale: 'locrian',   volume: 60, noteLength: 'eighth' },
            confused:    { instrument: 'fx pad',    scale: 'chromatic', volume: 70, noteLength: 'eighth' },
            rejected:    { instrument: 'pizzicato', scale: 'minor',     volume: 65, noteLength: 'eighth' },
            focused:     { instrument: 'piano',     scale: 'dorian',    volume: 70, noteLength: 'half' },
            protective:  { instrument: 'trombone',  scale: 'major',     volume: 80, noteLength: 'quarter' }
        };

        const mapping = emotionMappings[emotion] || {
            instrument: instruments[0],
            scale: scale,
            volume: 70,
            noteLength: 'half'
        };

        return {
            ...mapping,
            baseFrequency: this.getBaseFrequencyFromDot(dot),
            llmGenerated: false
        };
    }

    async generateMelodyForLyrics() {
        if (!this.currentLyrics || !this.musicTimeline) return;

        // Parse lyrics into syllables for synchronization
        const lyricsLines = this.currentLyrics.split('\n').filter(line => line.trim());
        const syllables = [];
        
        lyricsLines.forEach(line => {
            if (line.trim()) {
                const words = line.trim().split(/\s+/);
                words.forEach(word => {
                    // Simple syllable counting (vowel groups)
                    const syllableCount = Math.max(1, (word.match(/[aeiouAEIOU]+/g) || []).length);
                    for (let i = 0; i < syllableCount; i++) {
                        syllables.push({
                            text: i === 0 ? word : '',
                            lineIndex: lyricsLines.indexOf(line),
                            wordIndex: words.indexOf(word),
                            syllableIndex: i
                        });
                    }
                });
            }
        });

        // Generate melody using LLM if available
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            try {
                const emotionContext = this.extractEmotionContext();
                const prompt = `Generate a melodic progression for consciousness-themed lyrics with ${syllables.length} syllables.

Musical context:
- Total syllables to synchronize: ${syllables.length}
- Emotional themes: ${emotionContext.emotions.join(', ')}
- Preferred scales: ${emotionContext.scales.join(', ')}
- Time signature: 4/4

Create a melody that:
1. Uses note progressions that reflect emotional journey
2. Incorporates mathematical concepts like cobordism (smooth transitions) and homotopy (continuous deformations)
3. Has melodic phrases that support the lyrical meaning
4. Uses intervals and chord progressions suitable for consciousness/meditation themes
5. Balances repetition with variation for memorability

Do not say anything and just return a JSON array of ${syllables.length} notes with format:
[{"note": "C4", "duration": 0.5, "emotion": "calm"}, ...]

Use standard musical notation (C4, D4, E4, etc.) and durations in seconds.`;

                const melodyResult = await this.generateMelodyWithLLM(prompt);
                if (melodyResult) {
                    this.synchronizedMelody = melodyResult;
                    return;
                }
            } catch (error) {
                console.warn('LLM melody generation failed, using algorithmic approach:', error);
            }
        }

        // Fallback: Generate melody using cobordism and homotopy concepts
        this.synchronizedMelody = this.generateAlgorithmicMelody(syllables);
    }

    extractEmotionContext() {
        const timeline = this.musicTimeline.timeline;
        const emotions = [];
        const scales = [];

        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                Object.values(timeline).forEach(dayData => {
                    Object.values(dayData).forEach(entry => {
                        if (entry && entry.dot) {
                            emotions.push(entry.dot.name.toLowerCase());
                            const mapping = this.musicMapping?.get(entry.dot.id);
                            if (mapping?.scale) scales.push(mapping.scale);
                        }
                    });
                });
            } else {
                Object.values(timeline).forEach(entry => {
                    if (entry && entry.dot) {
                        emotions.push(entry.dot.name.toLowerCase());
                        const mapping = this.musicMapping?.get(entry.dot.id);
                        if (mapping?.scale) scales.push(mapping.scale);
                    }
                });
            }
        }

        return {
            emotions: [...new Set(emotions)],
            scales: [...new Set(scales)]
        };
    }

    generateAlgorithmicMelody(syllables) {
        const melody = [];
        const baseScale = this.scales.major; // Default to major scale
        
        syllables.forEach((syllable, index) => {
            // Apply cobordism concept: smooth transitions between notes
            const progressionFactor = index / syllables.length;
            
            // Apply homotopy concept: continuous deformation of melody
            const emotionalWeight = Math.sin(progressionFactor * Math.PI); // Creates arch shape
            
            // Select note based on syllable position and emotional progression
            let noteIndex = (syllable.lineIndex * 2 + syllable.wordIndex) % baseScale.length;
            
            // Add homotopic deformation
            const deformation = Math.floor(emotionalWeight * 3) - 1; // -1, 0, or 1
            noteIndex = Math.max(0, Math.min(baseScale.length - 1, noteIndex + deformation));
            
            // Apply cobordism for smooth transitions
            if (index > 0) {
                const prevNote = melody[index - 1];
                const intervalLimit = 3; // Max interval jump
                const prevNoteIndex = baseScale.indexOf(prevNote.frequency);
                
                if (Math.abs(noteIndex - prevNoteIndex) > intervalLimit) {
                    // Smooth the transition
                    noteIndex = prevNoteIndex + Math.sign(noteIndex - prevNoteIndex) * intervalLimit;
                    noteIndex = Math.max(0, Math.min(baseScale.length - 1, noteIndex));
                }
            }
            
            melody.push({
                frequency: baseScale[noteIndex],
                duration: syllable.text ? 0.8 : 0.6, // Longer for word starts
                syllable: syllable,
                noteIndex: noteIndex,
                emotion: this.getEmotionForSyllable(syllable, progressionFactor)
            });
        });

        return melody;
    }

    getEmotionForSyllable(syllable, progressionFactor) {
        // Map progression to emotional journey
        if (progressionFactor < 0.3) return 'beginning';
        if (progressionFactor < 0.7) return 'development';
        return 'resolution';
    }

    async generateLLMEnhancedMelody() {
        if (!this.llmSettings.apiKey || !this.musicTimeline) return null;

        const allEntries = this.getAllTimelineEntries();
        const emotionContext = this.extractEmotionContext();
        const lyricsLines = this.currentLyrics ? this.currentLyrics.split('\n').filter(line => line.trim()) : [];

        const prompt = `Generate an enhanced musical melody using cobordism and homotopy mathematical concepts for consciousness-themed composition.

Musical Context:
- Total entries: ${allEntries.length}
- Emotions: ${emotionContext.emotions.join(', ')}
- Scales available: ${emotionContext.scales.join(', ')}
- Lyrics lines: ${lyricsLines.length}

Mathematical Framework:
- Cobordism: Create smooth transitions between emotional states in musical space
- Homotopy: Allow continuous deformation of melodic patterns while preserving emotional essence
- Musical topology: Consider each note as a point in emotional-frequency space

Requirements:
1. Generate ${Math.max(allEntries.length, 16)} musical notes
2. Apply cobordism for smooth frequency transitions
3. Use homotopy for rhythmic variations that preserve emotional meaning
4. Create mathematical progression that reflects consciousness journey
5. Synchronize with emotional timeline progression

Do not say anything and just return this JSON format:
{
  "notes": [
    {
      "frequency": 440.0,
      "duration": 0.8,
      "emotion": "calm",
      "cobordism_factor": 0.7,
      "homotopy_variation": "gentle_rise"
    },
    ...
  ],
  "mathematical_structure": {
    "cobordism_transitions": ["smooth", "gradual"],
    "homotopy_deformations": ["rhythmic_variation", "pitch_modulation"]
  }
}`;

        try {
            const result = await this.generateLLMContent(prompt);
            if (result && result.notes && Array.isArray(result.notes)) {
                return result.notes.map((note, index) => ({
                    frequency: note.frequency || 440,
                    duration: note.duration || 0.8,
                    emotion: note.emotion || 'neutral',
                    cobordismFactor: note.cobordism_factor || 0.5,
                    homotopyVariation: note.homotopy_variation || 'none',
                    syllable: lyricsLines[Math.floor(index / 2)] ? {
                        text: lyricsLines[Math.floor(index / 2)].split(' ')[index % 4] || '',
                        lineIndex: Math.floor(index / 2),
                        wordIndex: index % 4
                    } : null
                }));
            }
        } catch (error) {
            console.warn('LLM enhanced melody generation failed:', error);
        }
        return null;
    }

    async generateMelodyWithLLM(prompt) {
        try {
            if (this.llmSettings.provider === 'openai') {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.llmSettings.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.llmSettings.model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 500,
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    throw new Error(`OpenAI API error: ${response.status}`);
                }

                const data = await response.json();
                const content = data.choices[0].message.content;
                
                try {
                    return JSON.parse(content);
                } catch (e) {
                    console.warn('Could not parse melody JSON, using fallback');
                    return null;
                }
            }
        } catch (error) {
            console.warn('LLM melody generation failed:', error);
            return null;
        }
    }

    handleAutoExpand(keywordData) {
        document.getElementById('detected-keyword').textContent = keywordData.word;

        // Create suggested dot
        const suggestion = {
            name: keywordData.word.charAt(0).toUpperCase() + keywordData.word.slice(1),
            color: keywordData.suggestion.color,
            shape: keywordData.suggestion.shape,
            size: 'medium',
            animation: 'pulse',
            description: `Auto-generated from journal analysis`
        };

        const suggestedElement = this.createDotElement(suggestion, 50);
        document.getElementById('suggested-dot').innerHTML = '';
        document.getElementById('suggested-dot').appendChild(suggestedElement);

        this.currentSuggestion = suggestion;
        document.getElementById('auto-expand-modal').style.display = 'flex';
    }

    acceptSuggestion() {
        if (this.currentSuggestion) {
            this.currentSuggestion.id = Date.now();
            this.dictionary.push(this.currentSuggestion);
            this.saveToStorage();
            this.renderDictionary();
            this.renderAvailableDots();
        }
        document.getElementById('auto-expand-modal').style.display = 'none';
    }

    editSuggestion() {
        if (this.currentSuggestion) {
            // Switch to language module and populate form
            this.switchModule('language');
            document.getElementById('dot-name').value = this.currentSuggestion.name;
            document.getElementById('dot-description').value = this.currentSuggestion.description;
            document.getElementById('dot-color').value = this.currentSuggestion.color;
            document.getElementById('dot-size').value = this.currentSuggestion.size;
            document.getElementById('dot-shape').value = this.currentSuggestion.shape;
            document.getElementById('dot-animation').value = this.currentSuggestion.animation;
            this.updateDotPreview();
        }
        document.getElementById('auto-expand-modal').style.display = 'none';
    }

    rejectSuggestion() {
        document.getElementById('auto-expand-modal').style.display = 'none';
    }

    saveTimelineEntry() {
        if (this.selectedHour === null) return;

        const activeType = document.querySelector('.entry-type-btn.active').dataset.type;
        let selectedDot = null;
        let journalText = '';

        if (activeType === 'dot') {
            const selected = document.querySelector('.selectable-dot.selected');
            if (selected) {
                const dotId = parseInt(selected.dataset.dotId);
                selectedDot = this.dictionary.find(d => d.id === dotId);
            }
        } else {
            journalText = document.getElementById('journal-text').value.trim();
            // Check if user selected a dot from analyzed results or available dots
            const selected = document.querySelector('.selectable-dot.selected');
            if (selected) {
                const dotId = parseInt(selected.dataset.dotId);
                selectedDot = this.dictionary.find(d => d.id === dotId);
            }
        }

        // Require dot selection - entry cannot be saved without a dot
        if (!selectedDot) {
            if (activeType === 'journal' && journalText) {
                alert('Please select a dot from the analyzed emotions or available dots. Timeline entries require both a dot emoji and optional journal text.');
            } else {
                alert('Please select a dot emoji. Timeline entries cannot be saved without a dot.');
            }
            return;
        }

        // Initialize timeline data structure
        if (!this.timelineData[this.currentDate]) {
            this.timelineData[this.currentDate] = {};
        }

        this.timelineData[this.currentDate][this.selectedHour] = {
            dot: selectedDot,
            journal: journalText,
            timestamp: new Date().toISOString()
        };

        this.saveToStorage();
        this.renderHourRing();
        this.renderDictionary(); // Update dictionary display with any new dots
        this.cancelEntry();
        alert('Entry saved successfully!');
    }

    cancelEntry() {
        document.getElementById('entry-panel').style.display = 'none';
        document.getElementById('journal-text').value = '';
        document.getElementById('analyzed-dots').innerHTML = '';
        document.querySelectorAll('.selectable-dot').forEach(el => el.classList.remove('selected'));
        this.selectedHour = null;
    }

    playTimeline() {
        const dayData = this.timelineData[this.currentDate];
        if (!dayData || Object.keys(dayData).length === 0) {
            alert('No timeline data for today. Add some entries first!');
            return;
        }

        // Create or get timeline details display
        let detailsDisplay = document.getElementById('timeline-details');
        if (!detailsDisplay) {
            detailsDisplay = document.createElement('div');
            detailsDisplay.id = 'timeline-details';
            detailsDisplay.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                border: 1px solid var(--glass-border);
                border-radius: 15px;
                padding: 20px;
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            `;

            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            closeBtn.addEventListener('click', () => {
                detailsDisplay.style.display = 'none';
            });
            detailsDisplay.appendChild(closeBtn);
            document.body.appendChild(detailsDisplay);
        }

        // Simple animation - highlight hours with entries in sequence
        const hours = Object.keys(dayData).map(h => parseInt(h)).sort((a, b) => a - b);
        let index = 0;

        // Change button text to indicate playing
        const playButton = document.getElementById('play-timeline');
        const originalText = playButton.textContent;
        playButton.textContent = 'Playing Timeline...';
        playButton.disabled = true;

        const animate = () => {
            if (index >= hours.length) {
                // Reset button when done
                playButton.textContent = originalText;
                playButton.disabled = false;
                // Hide details after a delay
                setTimeout(() => {
                    if (detailsDisplay) {
                        detailsDisplay.style.display = 'none';
                    }
                }, 3000);
                return;
            }

            // Reset previous highlights
            document.querySelectorAll('.hour-marker').forEach(marker => {
                marker.style.transform = 'scale(1)';
                marker.style.zIndex = '1';
                marker.style.boxShadow = 'none';
            });

            // Highlight current hour
            const hour = hours[index];
            const entry = dayData[hour];
            const marker = document.querySelector('[data-hour="' + hour + '"]');

            if (marker) {
                marker.style.transform = 'scale(1.5)';
                marker.style.zIndex = '10';
                marker.style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.8)';
                marker.style.transition = 'all 0.3s ease';

                // Show entry details
                detailsDisplay.style.display = 'block';
                detailsDisplay.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <h3 style="margin: 0; color: var(--primary-color);">${hour}:00</h3>
                        ${entry.dot ? this.createDotElement(entry.dot, 40).outerHTML : ''}
                        ${entry.dot ? `<span style="font-weight: bold;">${entry.dot.name}</span>` : ''}
                    </div>
                    ${entry.dot ? `
                        <div style="margin-bottom: 10px;">
                            <strong>Dot Details:</strong><br>
                            <span style="color: ${entry.dot.color};">Color: ${entry.dot.color}</span> | 
                            Shape: ${entry.dot.shape} | 
                            Size: ${entry.dot.size} | 
                            Animation: ${entry.dot.animation}
                            ${entry.dot.description ? `<br><em>${entry.dot.description}</em>` : ''}
                        </div>
                    ` : ''}
                    ${entry.journal ? `
                        <div>
                            <strong>Journal Entry:</strong><br>
                            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-top: 5px;">
                                ${entry.journal}
                            </div>
                        </div>
                    ` : ''}
                `;

                setTimeout(() => {
                    if (marker) {
                        marker.style.transform = 'scale(1)';
                        marker.style.zIndex = '1';
                        marker.style.boxShadow = 'none';
                    }
                }, 800);
            }

            index++;
            setTimeout(animate, 2000); // Increased time to read details
        };

        animate();
    }

    exportTimelinePNG() {
        const dayData = this.timelineData[this.currentDate] || {};
        const entryCount = Object.keys(dayData).length;

        if (entryCount === 0) {
            alert('No timeline data for this date. Add some entries first!');
            return;
        }

        // Generate the mandala image
        const mandalaDataURL = this.generateMandalaImage();
        
        // Show preview modal
        this.showMandalaPreview(mandalaDataURL, false);
    }

    generateMandalaImage() {
        // Create a high-resolution canvas representation of the consciousness clock
        const canvas = document.createElement('canvas');
        const scale = 2; // For high DPI displays
        canvas.width = 1000 * scale;
        canvas.height = 1000 * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);

        // Draw gradient background
        const gradient = ctx.createRadialGradient(500, 500, 0, 500, 500, 400);
        gradient.addColorStop(0, '#2a5298');
        gradient.addColorStop(1, '#1e3c72');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1000, 1000);

        // Draw outer glow circle
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(500, 500, 350, 0, Math.PI * 2);
        ctx.stroke();

        // Draw main clock circle
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(500, 500, 320, 0, Math.PI * 2);
        ctx.stroke();

        // Draw inner circle
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(500, 500, 280, 0, Math.PI * 2);
        ctx.stroke();

        // Draw hour markers and dots
        const dayData = this.timelineData[this.currentDate] || {};
        const entryCount = Object.keys(dayData).length;

        for (let hour = 0; hour < 24; hour++) {
            const angle = (hour * 15) - 90;
            const radius = 320;
            const x = Math.cos(angle * Math.PI / 180) * radius + 500;
            const y = Math.sin(angle * Math.PI / 180) * radius + 500;

            // Draw hour line
            const innerX = Math.cos(angle * Math.PI / 180) * 280 + 500;
            const innerY = Math.sin(angle * Math.PI / 180) * 280 + 500;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            if (dayData[hour] && dayData[hour].dot) {
                const dot = dayData[hour].dot;

                // Draw dot with glow effect
                ctx.shadowColor = dot.color;
                ctx.shadowBlur = 15;
                ctx.fillStyle = dot.color;
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, Math.PI * 2);
                ctx.fill();

                // Reset shadow
                ctx.shadowBlur = 0;

                // Draw dot border
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, Math.PI * 2);
                ctx.stroke();

                // Add dot initial
                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(dot.name.charAt(0).toUpperCase(), x, y);

                // Add hour number outside
                ctx.fillStyle = '#4ecdc4';
                ctx.font = 'bold 12px Inter';
                const labelX = Math.cos(angle * Math.PI / 180) * 360 + 500;
                const labelY = Math.sin(angle * Math.PI / 180) * 360 + 500;
                ctx.fillText(hour.toString(), labelX, labelY);

            } else {
                // Empty hour marker
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 18, 0, Math.PI * 2);
                ctx.stroke();

                // Hour number
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(hour.toString(), x, y);
            }
        }

        // Add center decoration
        ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
        ctx.beginPath();
        ctx.arc(500, 500, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(500, 500, 40, 0, Math.PI * 2);
        ctx.stroke();

        // Add title and info
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Consciousness Mandala', 500, 60);

        ctx.font = '18px Inter';
        ctx.fillText(this.formatDate(this.currentDate), 500, 100);

        ctx.font = '14px Inter';
        ctx.fillStyle = '#4ecdc4';
        ctx.fillText(`${entryCount} of 24 hours logged`, 500, 130);

        // Add legend
        if (entryCount > 0) {
            ctx.font = '12px Inter';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'left';
            ctx.fillText('Each colored dot represents your emotional state for that hour', 50, 950);
            ctx.fillText('Generated by Dot Symphony - Consciousness Expression App', 50, 970);
        }

        return canvas.toDataURL('image/png', 1.0);
    }

    showMandalaPreview(imageDataURL, isGIF = false) {
        // Create modal for preview
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            overflow-y: auto;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            max-width: 95%;
            max-height: 95%;
            overflow-y: auto;
            position: relative;
            text-align: center;
            padding: 20px;
        `;

        const fileType = isGIF ? 'GIF' : 'PNG';
        content.innerHTML = `
            <h2 style="color: var(--primary-color); margin-bottom: 20px;">📸 Consciousness Mandala Preview</h2>
            <div style="margin-bottom: 20px;">
                <img src="${imageDataURL}" alt="Consciousness Mandala" style="max-width: 100%; max-height: 60vh; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                <button id="download-image" class="btn btn-success">💾 Download ${fileType}</button>
                <button id="print-image" class="btn btn-primary">🖨️ Print</button>
                <button id="print-pdf" class="btn btn-secondary">📄 Save as PDF</button>
            </div>
            <button id="close-preview" class="btn btn-danger">✕ Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('close-preview').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('download-image').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `consciousness-mandala-${this.currentDate}.${fileType.toLowerCase()}`;
            link.href = imageDataURL;
            link.click();
            alert(`Consciousness Mandala downloaded successfully as ${fileType}!`);
        });

        document.getElementById('print-image').addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Consciousness Mandala - ${this.formatDate(this.currentDate)}</title>
                    <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        img { max-width: 100%; max-height: 100vh; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <img src="${imageDataURL}" alt="Consciousness Mandala">
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });

        document.getElementById('print-pdf').addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Consciousness Mandala - ${this.formatDate(this.currentDate)}</title>
                    <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        img { max-width: 100%; max-height: 100vh; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <img src="${imageDataURL}" alt="Consciousness Mandala">
                </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
            alert('Use your browser\'s print dialog to save as PDF!');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    exportTimelineGIF() {
        const dayData = this.timelineData[this.currentDate] || {};
        const entryCount = Object.keys(dayData).length;

        if (entryCount === 0) {
            alert('No timeline data to export for this date. Add some entries first!');
            return;
        }

        // Generate the animated preview image
        const animatedPreviewDataURL = this.generateAnimatedPreview();
        
        // Show preview modal
        this.showMandalaPreview(animatedPreviewDataURL, true);
    }

    generateAnimatedPreview() {
        // Create a static preview representing the animated timeline
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        const dayData = this.timelineData[this.currentDate] || {};

        // Draw background
        const gradient = ctx.createRadialGradient(400, 400, 0, 400, 400, 300);
        gradient.addColorStop(0, '#2a5298');
        gradient.addColorStop(1, '#1e3c72');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 800);

        // Draw clock circle
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(400, 400, 250, 0, Math.PI * 2);
        ctx.stroke();

        // Draw all dots with animation indicators
        Object.keys(dayData).forEach((hour, index) => {
            const entry = dayData[hour];
            if (entry && entry.dot) {
                const angle = (hour * 15) - 90;
                const radius = 250;
                const x = Math.cos(angle * Math.PI / 180) * radius + 400;
                const y = Math.sin(angle * Math.PI / 180) * radius + 400;

                // Draw connection line to show progression
                if (index > 0) {
                    const prevHour = Object.keys(dayData)[index - 1];
                    const prevAngle = (prevHour * 15) - 90;
                    const prevX = Math.cos(prevAngle * Math.PI / 180) * radius + 400;
                    const prevY = Math.sin(prevAngle * Math.PI / 180) * radius + 400;
                    
                    ctx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }

                // Draw dot with glow
                ctx.shadowColor = entry.dot.color;
                ctx.shadowBlur = 15;
                ctx.fillStyle = entry.dot.color;
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;

                // Add animation number
                ctx.fillStyle = 'white';
                ctx.font = 'bold 10px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText((index + 1).toString(), x, y);
            }
        });

        // Add title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Consciousness Animation Preview', 400, 50);
        ctx.font = '16px Inter';
        ctx.fillText(this.formatDate(this.currentDate), 400, 80);
        ctx.font = '12px Inter';
        ctx.fillStyle = '#4ecdc4';
        ctx.fillText('Numbers show animation sequence', 400, 750);

        return canvas.toDataURL();
    }

    downloadFramesAsZip(frames) {
        // For now, download the final frame as PNG with animation info
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        const dayData = this.timelineData[this.currentDate] || {};

        // Draw final state with all dots
        const gradient = ctx.createRadialGradient(400, 400, 0, 400, 400, 300);
        gradient.addColorStop(0, '#2a5298');
        gradient.addColorStop(1, '#1e3c72');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 800);

        // Draw clock circle
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(400, 400, 250, 0, Math.PI * 2);
        ctx.stroke();

        // Draw all dots
        Object.keys(dayData).forEach(hour => {
            const entry = dayData[hour];
            if (entry && entry.dot) {
                const angle = (hour * 15) - 90;
                const radius = 250;
                const x = Math.cos(angle * Math.PI / 180) * radius + 400;
                const y = Math.sin(angle * Math.PI / 180) * radius + 400;

                ctx.fillStyle = entry.dot.color;
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(entry.dot.name.charAt(0), x, y);
            }
        });

        // Add title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Consciousness Animation', 400, 50);
        ctx.font = '16px Inter';
        ctx.fillText(this.formatDate(this.currentDate), 400, 80);
        ctx.font = '12px Inter';
        ctx.fillStyle = '#4ecdc4';
        ctx.fillText('Animated timeline preview', 400, 750);

        // Download
        const link = document.createElement('a');
        link.download = `consciousness-animation-${this.currentDate}.png`;
        link.href = canvas.toDataURL();
        link.click();

        alert('Animated timeline preview exported! Full GIF export coming soon.');
    }

    exportTimelineJSON() {
        const dayData = this.timelineData[this.currentDate] || {};
        const entryCount = Object.keys(dayData).length;

        // Calculate some statistics
        const emotions = [];
        const journalEntries = [];
        Object.values(dayData).forEach(entry => {
            if (entry.dot) emotions.push(entry.dot.name);
            if (entry.journal) journalEntries.push(entry.journal);
        });

        const emotionFrequency = {};
        emotions.forEach(emotion => {
            emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
        });

        const data = {
            metadata: {
                date: this.currentDate,
                formatted_date: this.formatDate(this.currentDate),
                exported: new Date().toISOString(),
                total_entries: entryCount,
                total_hours_tracked: entryCount,
                completion_percentage: Math.round((entryCount / 24) * 100),
                version: '1.0'
            },
            statistics: {
                emotion_frequency: emotionFrequency,
                most_common_emotion: emotions.length > 0 ? 
                    Object.keys(emotionFrequency).reduce((a, b) => emotionFrequency[a] > emotionFrequency[b] ? a : b) : null,
                total_journal_entries: journalEntries.length,
                unique_emotions: [...new Set(emotions)].length
            },
            timeline: dayData,
            dictionary: this.dictionary,
            raw_data: {
                hours_with_entries: Object.keys(dayData).map(h => parseInt(h)).sort((a, b) => a - b),
                emotions_list: emotions,
                total_dictionary_size: this.dictionary.length
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consciousness-log-${this.currentDate}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert(`Timeline exported successfully!\n${entryCount} entries from ${this.formatDate(this.currentDate)}`);
    }

    generateMedicalReport() {
        // Collect data from selected date range (last 7 days by default, or current date if no range data)
        const endDate = new Date(this.currentDate);
        const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000); // 7 days total
        
        let reportData = {};
        let totalEntries = 0;
        let allEmotions = [];
        let allJournalEntries = [];
        let dailySummary = [];
        let sleepPatterns = [];
        let moodVariability = [];

        // Collect data from date range
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayData = this.timelineData[dateStr] || {};
            const dayEntries = Object.keys(dayData).length;
            
            if (dayEntries > 0) {
                reportData[dateStr] = dayData;
                totalEntries += dayEntries;
                
                const dayEmotions = [];
                const dayJournals = [];
                
                Object.entries(dayData).forEach(([hour, entry]) => {
                    if (entry.dot) {
                        dayEmotions.push({
                            hour: parseInt(hour),
                            emotion: entry.dot.name,
                            color: entry.dot.color
                        });
                        allEmotions.push(entry.dot.name);
                    }
                    if (entry.journal) {
                        dayJournals.push(entry.journal);
                        allJournalEntries.push(entry.journal);
                    }
                });

                // Analyze sleep patterns (entries between 22-6)
                const sleepHours = dayEmotions.filter(e => e.hour >= 22 || e.hour <= 6);
                sleepPatterns.push({
                    date: dateStr,
                    sleepEntries: sleepHours.length,
                    sleepEmotions: sleepHours.map(e => e.emotion)
                });

                // Calculate mood variability for the day
                const uniqueEmotions = [...new Set(dayEmotions.map(e => e.emotion))];
                moodVariability.push({
                    date: dateStr,
                    totalEntries: dayEntries,
                    uniqueEmotions: uniqueEmotions.length,
                    dominantEmotion: this.calculateDominantEmotion(dayEmotions),
                    moodStability: dayEntries > 0 ? (uniqueEmotions.length / dayEntries) : 0
                });

                dailySummary.push({
                    date: dateStr,
                    formattedDate: this.formatDate(dateStr),
                    entries: dayEntries,
                    emotions: dayEmotions,
                    journalCount: dayJournals.length,
                    coveragePercentage: Math.round((dayEntries / 24) * 100)
                });
            }
        }

        if (totalEntries === 0) {
            alert('No data available for report generation. Please add some entries in the Mind State Tracker first.');
            return;
        }

        // Calculate comprehensive statistics
        const emotionFrequency = {};
        allEmotions.forEach(emotion => {
            emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
        });

        const topEmotions = Object.entries(emotionFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const avgDailyEntries = totalEntries / dailySummary.length;
        const avgMoodVariability = moodVariability.reduce((sum, day) => sum + day.moodStability, 0) / moodVariability.length;

        // Generate medical-grade report
        const reportContent = this.formatMedicalReport({
            patientInfo: {
                reportDate: new Date().toISOString().split('T')[0],
                assessmentPeriod: `${this.formatDate(startDate.toISOString().split('T')[0])} to ${this.formatDate(endDate.toISOString().split('T')[0])}`,
                totalDaysTracked: dailySummary.length,
                dataCompleteness: Math.round((totalEntries / (dailySummary.length * 24)) * 100)
            },
            executiveSummary: {
                totalEntries,
                avgDailyEntries: Math.round(avgDailyEntries * 10) / 10,
                moodVariabilityIndex: Math.round(avgMoodVariability * 100),
                dominantEmotions: topEmotions,
                journalCompliance: Math.round((allJournalEntries.length / totalEntries) * 100)
            },
            dailyAnalysis: dailySummary,
            emotionalPatterns: {
                frequency: emotionFrequency,
                stability: moodVariability,
                sleepRelated: sleepPatterns
            },
            clinicalObservations: this.generateClinicalObservations(allEmotions, moodVariability, sleepPatterns),
            recommendations: this.generateRecommendations(emotionFrequency, avgMoodVariability, totalEntries)
        });

        // Show report preview in modal
        this.showReportPreview(reportContent, dailySummary.length, totalEntries);
    }

    calculateDominantEmotion(dayEmotions) {
        if (dayEmotions.length === 0) return 'No data';
        
        const frequency = {};
        dayEmotions.forEach(e => {
            frequency[e.emotion] = (frequency[e.emotion] || 0) + 1;
        });
        
        return Object.entries(frequency).reduce((a, b) => frequency[a[0]] > frequency[b[0]] ? a : b)[0];
    }

    formatMedicalReport(data) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consciousness Tracking Report</title>
    <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .section h2 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        .section h3 { color: #34495e; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .metric { display: inline-block; margin: 10px 15px 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .emotion-bar { height: 20px; background: #3498db; margin: 2px 0; border-radius: 3px; }
        .clinical-note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .recommendation { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 10px 0; }
        @media print { body { margin: 20px; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONSCIOUSNESS TRACKING REPORT</h1>
        <p><strong>Assessment Period:</strong> ${data.patientInfo.assessmentPeriod}</p>
        <p><strong>Report Generated:</strong> ${this.formatDate(data.patientInfo.reportDate)}</p>
        <p><strong>Generated by:</strong> Dot Symphony Consciousness Expression App</p>
    </div>

    <div class="section">
        <h2>EXECUTIVE SUMMARY</h2>
        <div class="metric"><strong>Total Data Points:</strong> ${data.executiveSummary.totalEntries}</div>
        <div class="metric"><strong>Days Tracked:</strong> ${data.patientInfo.totalDaysTracked}</div>
        <div class="metric"><strong>Average Daily Entries:</strong> ${data.executiveSummary.avgDailyEntries}</div>
        <div class="metric"><strong>Data Completeness:</strong> ${data.patientInfo.dataCompleteness}%</div>
        <div class="metric"><strong>Mood Variability Index:</strong> ${data.executiveSummary.moodVariabilityIndex}%</div>
        <div class="metric"><strong>Journal Compliance:</strong> ${data.executiveSummary.journalCompliance}%</div>
    </div>

    <div class="section">
        <h2>EMOTIONAL STATE ANALYSIS</h2>
        <h3>Most Frequent Emotional States</h3>
        <table>
            <tr><th>Emotion</th><th>Frequency</th><th>Percentage</th><th>Visual Representation</th></tr>
            ${data.executiveSummary.dominantEmotions.map(([emotion, count]) => {
                const percentage = Math.round((count / data.executiveSummary.totalEntries) * 100);
                return `<tr>
                    <td><strong>${emotion}</strong></td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                    <td><div class="emotion-bar" style="width: ${percentage * 2}px;"></div></td>
                </tr>`;
            }).join('')}
        </table>
    </div>

    <div class="section">
        <h2>DAILY ANALYSIS BREAKDOWN</h2>
        <table>
            <tr><th>Date</th><th>Entries</th><th>Coverage</th><th>Dominant Emotion</th><th>Unique States</th></tr>
            ${data.dailyAnalysis.map(day => `
                <tr>
                    <td>${day.formattedDate}</td>
                    <td>${day.entries}</td>
                    <td>${day.coveragePercentage}%</td>
                    <td>${day.emotions.length > 0 ? this.calculateDominantEmotion(day.emotions) : 'No data'}</td>
                    <td>${[...new Set(day.emotions.map(e => e.emotion))].length}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    <div class="section">
        <h2>CLINICAL OBSERVATIONS</h2>
        ${data.clinicalObservations.map(obs => `<div class="clinical-note"><strong>${obs.category}:</strong> ${obs.observation}</div>`).join('')}
    </div>

    <div class="section">
        <h2>MOOD STABILITY ANALYSIS</h2>
        <table>
            <tr><th>Date</th><th>Stability Score</th><th>Interpretation</th></tr>
            ${data.emotionalPatterns.stability.map(day => {
                const stability = day.moodStability;
                const interpretation = stability < 0.3 ? 'Stable' : stability < 0.6 ? 'Moderate Variability' : 'High Variability';
                return `<tr>
                    <td>${this.formatDate(day.date)}</td>
                    <td>${Math.round(stability * 100)}%</td>
                    <td>${interpretation}</td>
                </tr>`;
            }).join('')}
        </table>
    </div>

    <div class="section">
        <h2>RECOMMENDATIONS</h2>
        ${data.recommendations.map(rec => `<div class="recommendation"><strong>${rec.category}:</strong> ${rec.recommendation}</div>`).join('')}
    </div>

    <div class="section">
        <h2>METHODOLOGY & DISCLAIMER</h2>
        <p><strong>Data Collection Method:</strong> Self-reported emotional states using the Dot Symphony consciousness tracking system. Data points represent hourly emotional state assessments using a personalized emotional vocabulary.</p>
        
        <p><strong>Assessment Tools:</strong> Digital consciousness clock with 24-hour tracking capability, custom emotional lexicon development, automated pattern recognition, and mood variability calculations.</p>
        
        <p><strong>Limitations:</strong> This report is based on self-reported data and should be considered supplementary to clinical assessment. The emotional categories are user-defined and may not align with standardized psychological assessments.</p>
        
        <p><strong>Clinical Note:</strong> This digital wellness tracking report is intended to support clinical decision-making and should be interpreted alongside other assessment tools and clinical observation. Individual results may vary and should be evaluated within the context of the patient's overall health status.</p>
        
        <p><strong>Generated by:</strong> Dot Symphony v1.0 - A consciousness expression and tracking application.<br>
        <strong>Report Date:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
    </div>
</body>
</html>`;
    }

    generateClinicalObservations(emotions, moodVariability, sleepPatterns) {
        const observations = [];
        
        // Emotional pattern analysis
        const emotionFreq = {};
        emotions.forEach(e => emotionFreq[e] = (emotionFreq[e] || 0) + 1);
        const totalEmotions = emotions.length;
        
        if (totalEmotions === 0) {
            observations.push({
                category: 'Data Availability',
                observation: 'Insufficient data for comprehensive analysis. Recommend increased tracking consistency.'
            });
            return observations;
        }

        // Analyze predominant emotional states
        const topEmotion = Object.entries(emotionFreq).reduce((a, b) => emotionFreq[a[0]] > emotionFreq[b[0]] ? a : b);
        if (topEmotion[1] / totalEmotions > 0.4) {
            observations.push({
                category: 'Emotional Dominance',
                observation: `Subject shows significant predominance of "${topEmotion[0]}" state (${Math.round(topEmotion[1] / totalEmotions * 100)}% of tracked time). Consider exploring underlying factors.`
            });
        }

        // Analyze mood stability
        const avgVariability = moodVariability.reduce((sum, day) => sum + day.moodStability, 0) / moodVariability.length;
        if (avgVariability > 0.7) {
            observations.push({
                category: 'Mood Variability',
                observation: `High mood variability index (${Math.round(avgVariability * 100)}%) suggests significant emotional fluctuation throughout tracked period. May warrant attention to triggers and coping strategies.`
            });
        } else if (avgVariability < 0.2) {
            observations.push({
                category: 'Mood Stability',
                observation: `Low mood variability index (${Math.round(avgVariability * 100)}%) indicates stable emotional patterns. Consider whether this reflects genuine stability or potential emotional restriction.`
            });
        }

        // Sleep-related observations
        const totalSleepEntries = sleepPatterns.reduce((sum, day) => sum + day.sleepEntries, 0);
        if (totalSleepEntries > 0) {
            const avgSleepEntries = totalSleepEntries / sleepPatterns.length;
            if (avgSleepEntries < 2) {
                observations.push({
                    category: 'Sleep Monitoring',
                    observation: `Limited nighttime emotional tracking data. Consider including pre-sleep and sleep quality assessments for comprehensive analysis.`
                });
            }
        }

        // Data consistency analysis
        const consistentDays = moodVariability.filter(day => day.totalEntries >= 8).length;
        const consistencyRate = consistentDays / moodVariability.length;
        if (consistencyRate < 0.5) {
            observations.push({
                category: 'Data Consistency',
                observation: `Tracking consistency at ${Math.round(consistencyRate * 100)}%. Recommend establishing regular check-in times for more reliable patterns.`
            });
        }

        // Emotional complexity analysis
        const uniqueEmotions = [...new Set(emotions)];
        if (uniqueEmotions.length > 15) {
            observations.push({
                category: 'Emotional Complexity',
                observation: `High emotional vocabulary usage (${uniqueEmotions.length} distinct states). Indicates good emotional awareness and differentiation.`
            });
        } else if (uniqueEmotions.length < 5) {
            observations.push({
                category: 'Emotional Range',
                observation: `Limited emotional vocabulary in tracking (${uniqueEmotions.length} distinct states). Consider expanding emotional awareness and expression.`
            });
        }

        return observations;
    }

    generateRecommendations(emotionFreq, avgVariability, totalEntries) {
        const recommendations = [];
        
        if (totalEntries < 50) {
            recommendations.push({
                category: 'Data Collection',
                recommendation: 'Increase tracking frequency to at least 8-10 entries per day for more meaningful pattern analysis.'
            });
        }

        if (avgVariability > 0.6) {
            recommendations.push({
                category: 'Emotional Regulation',
                recommendation: 'Consider mindfulness practices, regular exercise, or stress management techniques to help stabilize mood patterns.'
            });
        }

        // Check for concerning emotional patterns
        const negativeEmotions = ['sad', 'angry', 'anxious', 'frustrated', 'overwhelmed', 'stressed', 'worried'];
        const negativeCount = Object.entries(emotionFreq).filter(([emotion]) => 
            negativeEmotions.some(neg => emotion.toLowerCase().includes(neg))
        ).reduce((sum, [, count]) => sum + count, 0);
        
        if (negativeCount / totalEntries > 0.6) {
            recommendations.push({
                category: 'Mental Health Support',
                recommendation: 'High frequency of challenging emotional states detected. Consider consulting with a mental health professional for additional support and coping strategies.'
            });
        }

        recommendations.push({
            category: 'Continued Monitoring',
            recommendation: 'Maintain regular consciousness tracking to identify long-term patterns and assess the effectiveness of any interventions.'
        });

        recommendations.push({
            category: 'Clinical Integration',
            recommendation: 'Share this report with healthcare providers to integrate consciousness tracking data with overall health assessment and treatment planning.'
        });

        return recommendations;
    }

    showReportPreview(reportContent, totalDays, totalEntries) {
        // Create modal for report preview
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            overflow-y: auto;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            position: relative;
        `;

        // Add controls
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: sticky;
            top: 0;
            background: white;
            padding: 15px 20px;
            border-bottom: 2px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 15px 15px 0 0;
            z-index: 10;
        `;

        controls.innerHTML = `
            <h3 style="margin: 0; color: #333;">Report Preview</h3>
            <div style="display: flex; gap: 10px;">
                <button id="print-report" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">🖨️ Print Report</button>
                <button id="download-report" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">💾 Download</button>
                <button id="close-preview" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">✕ Close</button>
            </div>
        `;

        // Add report content
        const reportDiv = document.createElement('div');
        reportDiv.innerHTML = reportContent;
        reportDiv.style.cssText = `
            padding: 20px;
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
        `;

        content.appendChild(controls);
        content.appendChild(reportDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('close-preview').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('print-report').addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(reportContent);
            printWindow.document.close();
            printWindow.print();
        });

        document.getElementById('download-report').addEventListener('click', () => {
            const blob = new Blob([reportContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `consciousness-report-${this.currentDate}.html`;
            a.click();
            URL.revokeObjectURL(url);
            alert('Report downloaded successfully!');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // MUSIC COMPOSER METHODS
    initializeMusicCanvas() {
        this.musicCanvas = document.getElementById('musicCanvas');
        this.musicCtx = this.musicCanvas.getContext('2d');
        
        // Initialize default date range
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        document.getElementById('start-date').value = weekAgo.toISOString().split('T')[0];
        document.getElementById('end-date').value = today.toISOString().split('T')[0];
    }

    loadTimelineRange() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('Start date must be before end date');
            return;
        }

        // Collect timeline data from the date range
        const rangeData = {};
        const metadata = {
            startDate,
            endDate,
            totalDays: 0,
            totalEntries: 0,
            datesIncluded: []
        };

        // Iterate through each day in the range
        const currentDate = new Date(startDate);
        const endDateTime = new Date(endDate);

        while (currentDate <= endDateTime) {
            const dateStr = currentDate.toISOString().split('T')[0];
            metadata.datesIncluded.push(dateStr);
            metadata.totalDays++;

            if (this.timelineData[dateStr]) {
                rangeData[dateStr] = this.timelineData[dateStr];
                metadata.totalEntries += Object.keys(this.timelineData[dateStr]).length;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (metadata.totalEntries === 0) {
            alert('No timeline data found in the selected date range. Please add some entries in the Mind State Tracker first.');
            return;
        }

        // Create music timeline from range data
        this.musicTimeline = {
            metadata,
            timeline: rangeData,
            dictionary: this.dictionary,
            version: '1.0'
        };

        this.renderImportedTimeline();
        this.generateMusicMapping();
        this.generateLyrics();
        alert(`Loaded ${metadata.totalEntries} entries from ${metadata.totalDays} days!`);
    }

    importMusicLog() {
        document.getElementById('import-log-file').click();
    }

    handleMusicLogImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.timeline) {
                    this.musicTimeline = data;
                    this.renderImportedTimeline();
                    this.generateMusicMapping();
                    this.generateLyrics();
                    alert('Timeline imported successfully!');
                } else {
                    alert('Invalid timeline file format');
                }
            } catch (err) {
                alert('Error reading file: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    renderImportedTimeline() {
        const container = document.getElementById('imported-timeline');
        container.style.display = 'block';
        container.innerHTML = '';

        if (!this.musicTimeline || !this.musicTimeline.timeline) {
            container.innerHTML = '<p>No timeline data imported</p>';
            return;
        }

        // Display metadata if available
        if (this.musicTimeline.metadata) {
            const metaDiv = document.createElement('div');
            metaDiv.style.cssText = 'background: rgba(78, 205, 196, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--primary-color);';
            metaDiv.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: var(--primary-color);">Timeline Summary</h4>
                <p style="margin: 5px 0;">📅 Date Range: ${this.formatDate(this.musicTimeline.metadata.startDate)} → ${this.formatDate(this.musicTimeline.metadata.endDate)}</p>
                <p style="margin: 5px 0;">📊 Total Entries: ${this.musicTimeline.metadata.totalEntries} across ${this.musicTimeline.metadata.totalDays} days</p>
                <p style="margin: 5px 0;">🎵 Ready for musical composition!</p>
            `;
            container.appendChild(metaDiv);
        }

        const timeline = this.musicTimeline.timeline;
        
        // Group entries by date
        Object.keys(timeline).sort().forEach(date => {
            const dayData = timeline[date];
            const hours = Object.keys(dayData).map(h => parseInt(h)).sort((a, b) => a - b);
            
            if (hours.length > 0) {
                // Date header
                const dateHeader = document.createElement('div');
                dateHeader.style.cssText = 'background: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 8px; margin: 15px 0 10px 0; font-weight: bold; color: var(--primary-color);';
                dateHeader.textContent = `${this.formatDate(date)} (${hours.length} entries)`;
                container.appendChild(dateHeader);

                // Entries for this date
                hours.forEach(hour => {
                    const entry = dayData[hour];
                    if (entry && entry.dot) {
                        const element = document.createElement('div');
                        element.className = 'timeline-entry';
                        element.innerHTML = `
                            <span style="font-weight: 500; color: #4ecdc4;">${hour}:00</span>
                            ${this.createDotElement(entry.dot, 30).outerHTML}
                            <span>${entry.dot.name}</span>
                            <span>${entry.journal ? '📝' : ''}</span>
                        `;
                        container.appendChild(element);
                    }
                });
            }
        });
    }

    async generateMusicMapping() {
        const container = document.getElementById('mapping-grid');
        container.innerHTML = '';

        if (!this.musicTimeline) return;

        // Show enhanced LLM status for music mapping
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            this.showLLMStatus('🎵 LLM Integration: Generating intelligent sound mapping...', 'info');
        } else {
            this.showLLMStatus('🎵 Template Mode: Using predefined sound mappings', 'warning');
        }

        // Initialize music mapping data if not exists
        if (!this.musicMapping) {
            this.musicMapping = new Map();
        }

        // Get unique dots from timeline
        const timeline = this.musicTimeline.timeline;
        const uniqueDots = new Map();

        // Handle different timeline structures (single date vs date range)
        if (typeof timeline === 'object') {
            // Check if it's a date range structure
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                // Date range structure: timeline[date][hour] = entry
                Object.values(timeline).forEach(dayData => {
                    Object.values(dayData).forEach(entry => {
                        if (entry && entry.dot) {
                            uniqueDots.set(entry.dot.id, entry.dot);
                        }
                    });
                });
            } else {
                // Single day structure: timeline[hour] = entry
                Object.values(timeline).forEach(entry => {
                    if (entry && entry.dot) {
                        uniqueDots.set(entry.dot.id, entry.dot);
                    }
                });
            }
        }

        if (uniqueDots.size === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">No dots found in timeline data</p>';
            return;
        }

        // Generate LLM-enhanced mappings for new dots
        for (const dot of uniqueDots.values()) {
            if (!this.musicMapping.has(dot.id)) {
                try {
                    if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
                        const llmMapping = await this.generateLLMSoundMapping(dot);
                        if (llmMapping) {
                            this.musicMapping.set(dot.id, llmMapping);
                            this.showLLMStatus(`✅ AI mapping created for ${dot.name}`, 'success');
                            continue;
                        }
                    }
                    // Fallback to enhanced template mapping
                    const templateMapping = this.generateTemplateSoundMapping(dot);
                    this.musicMapping.set(dot.id, templateMapping);
                } catch (error) {
                    console.warn(`LLM mapping failed for ${dot.name}:`, error);
                    this.showLLMStatus(`⚠️ AI failed for ${dot.name}, using template`, 'warning');
                    const templateMapping = this.generateTemplateSoundMapping(dot);
                    this.musicMapping.set(dot.id, templateMapping);
                }
            }
        }

        uniqueDots.forEach(dot => {
            const mappingItem = document.createElement('div');
            mappingItem.className = 'mapping-item';

            const mapping = this.musicMapping.get(dot.id);
            const emotion = this.getEmotionFromDot(dot);
            const availableInstruments = ['piano', 'guitar', 'synth', 'flute', 'strings', 'drums', 'bass', 'bells', 'harp'];

            mappingItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    ${this.createDotElement(dot, 40).outerHTML}
                    <div>
                        <h4 style="margin: 0;">${dot.name}</h4>
                        <small style="opacity: 0.7;">Emotion: ${emotion}</small>
                    </div>
                </div>
                <div class="mapping-controls">
                    <label>Instrument:</label>
                    <select data-dot-id="${dot.id}" data-property="instrument" style="width: 100%; padding: 8px; border-radius: 5px; background: var(--glass-bg); color: white; border: 1px solid var(--glass-border);">
                        ${availableInstruments.map(inst => `<option value="${inst}" ${mapping.instrument === inst ? 'selected' : ''}>${inst.charAt(0).toUpperCase() + inst.slice(1)}</option>`).join('')}
                    </select>

                    <label>Musical Scale:</label>
                    <select data-dot-id="${dot.id}" data-property="scale" style="width: 100%; padding: 8px; border-radius: 5px; background: var(--glass-bg); color: white; border: 1px solid var(--glass-border);">
                        <option value="major" ${mapping.scale === 'major' ? 'selected' : ''}>Major (Happy/Bright)</option>
                        <option value="minor" ${mapping.scale === 'minor' ? 'selected' : ''}>Minor (Sad/Dark)</option>
                        <option value="pentatonic" ${mapping.scale === 'pentatonic' ? 'selected' : ''}>Pentatonic (Calm/Eastern)</option>
                        <option value="blues" ${mapping.scale === 'blues' ? 'selected' : ''}>Blues (Soulful/Expressive)</option>
                    </select>

                    <label>Volume: <span id="volume-${dot.id}">${mapping.volume}%</span></label>
                    <input type="range" min="0" max="100" value="${mapping.volume}" data-dot-id="${dot.id}" data-property="volume" style="width: 100%;">

                    <label>Note Duration:</label>
                    <select data-dot-id="${dot.id}" data-property="noteLength" style="width: 100%; padding: 8px; border-radius: 5px; background: var(--glass-bg); color: white; border: 1px solid var(--glass-border);">
                        <option value="quarter" ${mapping.noteLength === 'quarter' ? 'selected' : ''}>Quarter Note (0.5s)</option>
                        <option value="half" ${mapping.noteLength === 'half' ? 'selected' : ''}>Half Note (1s)</option>
                        <option value="whole" ${mapping.noteLength === 'whole' ? 'selected' : ''}>Whole Note (2s)</option>
                    </select>

                    <button class="btn btn-small" onclick="dotSymphony.testDotSound(${dot.id})" style="margin-top: 10px; width: 100%;">🎵 Test Sound</button>
                </div>
            `;

            container.appendChild(mappingItem);
        });

        // Add event listeners for all mapping controls
        container.addEventListener('change', (e) => {
            const dotId = parseInt(e.target.dataset.dotId);
            const property = e.target.dataset.property;
            
            if (dotId && property && this.musicMapping.has(dotId)) {
                const mapping = this.musicMapping.get(dotId);
                mapping[property] = e.target.value;
                
                // Update volume display
                if (property === 'volume') {
                    const volumeDisplay = document.getElementById(`volume-${dotId}`);
                    if (volumeDisplay) {
                        volumeDisplay.textContent = e.target.value + '%';
                    }
                }
                
                // Auto-save the mapping
                this.saveMusicMapping();
            }
        });
    }

    getBaseFrequencyFromDot(dot) {
        // Generate base frequency from dot properties
        const colorValue = parseInt(dot.color.slice(1), 16);
        const nameValue = dot.name.charCodeAt(0);
        return 200 + ((colorValue + nameValue) % 400); // Range: 200-600 Hz
    }

    testDotSound(dotId) {
        if (!this.audioContext || !this.musicMapping.has(dotId)) {
            alert('Audio context not available or mapping not found');
            return;
        }

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const dot = this.dictionary.find(d => d.id === dotId);
        const mapping = this.musicMapping.get(dotId);
        
        if (!dot) {
            alert('Dot not found');
            return;
        }

        // Play a test note for this dot
        const scale = this.scales[mapping.scale] || this.scales.major;
        const frequency = scale[Math.abs(dot.name.charCodeAt(0)) % scale.length];
        const volume = mapping.volume / 100;
        const duration = mapping.noteLength === 'quarter' ? 0.5 : mapping.noteLength === 'half' ? 1 : 2;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Set waveform based on instrument
            const waveforms = {
                piano: 'triangle',
                guitar: 'sawtooth',
                synth: 'square',
                flute: 'sine',
                strings: 'sawtooth',
                drums: 'square',
                bass: 'triangle',
                bells: 'sine',
                harp: 'triangle'
            };

            oscillator.type = waveforms[mapping.instrument] || 'sine';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Increase volume for audibility
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.8, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);

            // Visual feedback - find the button that was clicked
            const buttons = document.querySelectorAll('.mapping-item button');
            buttons.forEach(button => {
                if (button.onclick && button.onclick.toString().includes(dotId)) {
                    const originalText = button.textContent;
                    button.textContent = '🎵 Playing...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, duration * 1000);
                }
            });

        } catch (e) {
            console.warn('Could not play test sound:', e);
            alert('Could not play test sound. Audio may be blocked by browser. Try clicking somewhere first.');
        }
    }

    saveMusicMapping() {
        if (this.musicMapping) {
            const mappingData = {};
            this.musicMapping.forEach((value, key) => {
                mappingData[key] = value;
            });
            localStorage.setItem('dot-symphony-music-mapping', JSON.stringify(mappingData));
        }
    }

    loadMusicMapping() {
        try {
            const stored = localStorage.getItem('dot-symphony-music-mapping');
            if (stored) {
                const mappingData = JSON.parse(stored);
                this.musicMapping = new Map();
                Object.entries(mappingData).forEach(([key, value]) => {
                    this.musicMapping.set(parseInt(key), value);
                });
            }
        } catch (e) {
            console.warn('Error loading music mapping:', e);
        }
    }

    getEmotionFromDot(dot) {
        // Try to match dot name to sentiment map
        const name = dot.name.toLowerCase();
        if (this.sentimentMap[name]) {
            return name;
        }

        // Fallback based on color (simple heuristic)
        const color = dot.color.toLowerCase();
        if (color.includes('ff') && color.includes('d7')) return 'joy'; // Yellow-ish
        if (color.includes('4e') && color.includes('cd')) return 'calm'; // Teal-ish
        if (color.includes('ff') && color.includes('6b')) return 'excited'; // Red-ish
        if (color.includes('64') && color.includes('95')) return 'sad'; // Blue-ish

        return 'calm'; // Default
    }

    getScaleFromEmotion(emotion) {
        const emotionScaleMap = {
            joy: 'major',
            happy: 'major',
            excited: 'major',
            calm: 'pentatonic',
            peaceful: 'pentatonic',
            relaxed: 'pentatonic',
            content: 'major',
            hopeful: 'lydian',
            grateful: 'major',
            love: 'lydian',
            nostalgic: 'dorian',
            motivated: 'dorian',
            focused: 'dorian',
            inspired: 'lydian',
            creative: 'lydian',
            confident: 'mixolydian',
            social: 'major',
            energized: 'mixolydian',
            anxious: 'minor',
            worried: 'phrygian',
            afraid: 'phrygian',
            scared: 'phrygian',
            confused: 'wholeTone',
            overwhelmed: 'diminished',
            frustrated: 'blues',
            angry: 'blues',
            sad: 'minor',
            tired: 'minor',
            lonely: 'japanese',
            dreamy: 'wholeTone',
            insecure: 'arabic',
            shy: 'arabic',
            curious: 'mixolydian',
            bored: 'chromatic'
        };

        return emotionScaleMap[emotion] || 'major';
    }

    async generateLyrics() {
        if (!this.musicTimeline) return;

        const container = document.getElementById('generated-lyrics');
        const timeline = this.musicTimeline.timeline;

        // Extract emotions and journal entries
        const emotions = [];
        const journalTexts = [];
        const timelineDetails = [];

        // Handle different timeline structures (single date vs date range)
        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                // Date range structure: timeline[date][hour] = entry
                Object.entries(timeline).forEach(([date, dayData]) => {
                    Object.entries(dayData).forEach(([hour, entry]) => {
                        if (entry && entry.dot) {
                            emotions.push(entry.dot.name.toLowerCase());
                            timelineDetails.push(`${date} ${hour}:00 - ${entry.dot.name}`);
                        }
                        if (entry && entry.journal) {
                            journalTexts.push(entry.journal);
                        }
                    });
                });
            } else {
                // Single day structure: timeline[hour] = entry
                Object.entries(timeline).forEach(([hour, entry]) => {
                    if (entry && entry.dot) {
                        emotions.push(entry.dot.name.toLowerCase());
                        timelineDetails.push(`${hour}:00 - ${entry.dot.name}`);
                    }
                    if (entry && entry.journal) {
                        journalTexts.push(entry.journal);
                    }
                });
            }
        }

        // Show loading state with enhanced LLM status
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            this.showLLMStatus('🎭 LLM Integration: Creating poetic lyrics with AI...', 'info');
            container.innerHTML = `
                <div style="padding: 15px; background: rgba(78, 205, 196, 0.1); border-radius: 10px; border: 1px solid var(--primary-color); margin-bottom: 15px;">
                    <p style="color: #4ecdc4; margin: 0; font-weight: bold;">🤖 LLM Integration: Auto-Generate Lyrics</p>
                    <p style="color: white; margin: 5px 0 0 0; font-size: 0.9em; font-style: italic;">AI is composing your consciousness lyrics with mathematical concepts...</p>
                </div>
            `;
        } else {
            this.showLLMStatus('📝 Template Mode: Using predefined patterns', 'warning');
            container.innerHTML = `
                <div style="padding: 15px; background: rgba(255, 234, 167, 0.1); border-radius: 10px; border: 1px solid var(--warning-color); margin-bottom: 15px;">
                    <p style="color: #ffeaa7; margin: 0; font-weight: bold;">📝 Template Mode: Auto-Generate Lyrics</p>
                    <p style="color: white; margin: 5px 0 0 0; font-size: 0.9em; font-style: italic;">Using predefined lyric templates. Configure LLM in settings for AI-powered lyrics.</p>
                </div>
            `;
        }

        // Always try LLM generation first if API key is available
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            try {
                const emotionList = [...new Set(emotions)].join(', ');
                const journalSummary = journalTexts.length > 0 ? journalTexts.join(' ') : 'No journal entries available';
                const noteCount = emotions.length;
                
                const prompt = `Create beautiful, poetic song lyrics using cobordism and homotopy concepts that will be synchronized with ${noteCount} musical notes.

Emotional journey: ${emotionList}
Timeline context: ${timelineDetails.slice(0, 8).join(', ')}${timelineDetails.length > 8 ? '...' : ''}
Journal insights: ${journalSummary.substring(0, 400)}${journalSummary.length > 400 ? '...' : ''}

Mathematical Framework:
- Cobordism: Smooth transitions between emotional states in lyrical flow
- Homotopy: Continuous deformation of themes while preserving emotional essence

Requirements:
1. Create exactly ${Math.max(8, Math.ceil(noteCount/2))} lines of lyrics
2. Each line should have 2-4 syllables for musical flow
3. Use consciousness, time, and emotional metaphors
4. Apply cobordism for smooth emotional transitions between lines
5. Use homotopy to maintain thematic continuity while allowing variation
6. Focus on inner growth and self-awareness themes
7. Make it personal and introspective

Structure the lyrics to synchronize well with musical notes, using short, meaningful phrases that can be sung melodically. Do not say anything and just provide the lyrics`;

                const llmResult = await this.generateLyricsWithLLM(prompt);
                
                if (llmResult && llmResult.trim()) {
                    this.currentLyrics = llmResult;
                    this.showLLMStatus('✅ AI lyrics generated successfully!', 'success');
                    await this.generateMelodyForLyrics(); // Generate synchronized melody
                    container.innerHTML = `
                        <div style="border-left: 3px solid var(--primary-color); padding-left: 15px; margin-bottom: 10px;">
                            <small style="color: var(--primary-color); font-weight: bold;">✨ AI Generated Consciousness Lyrics</small>
                        </div>
                        <div style="white-space: pre-line; line-height: 1.8; font-style: italic;">${llmResult}</div>
                        <div style="margin-top: 15px; padding: 10px; background: rgba(78, 205, 196, 0.1); border-radius: 10px; font-size: 0.9em;">
                            <strong>Mathematical Concepts:</strong> Cobordism for smooth transitions, Homotopy for thematic continuity<br>
                            <strong>Musical Synchronization:</strong> ${noteCount} notes with optimal syllable mapping
                        </div>
                    `;
                    return;
                }
            } catch (error) {
                console.warn('LLM lyrics generation failed:', error);
                this.showLLMStatus('❌ AI lyrics failed, using enhanced templates', 'error');
                container.innerHTML = '<p style="color: #ffa500;">🤖 AI generation failed. Using enhanced template-based lyrics...</p>';
            }
        }

        // Enhanced fallback with better synchronization
        const noteCount = emotions.length;
        const syllableTargets = Math.max(noteCount * 1.5, 16); // Target syllables for synchronization
        
        const enhancedTemplates = [
            "Hearts beat in {emotion1} time",
            "Souls dance through {emotion2} space", 
            "Minds flow with {emotion3} grace",
            "Time holds each sacred place",
            "",
            "Breath by breath we grow",
            "Feel the {emotion1} glow",
            "Let the {emotion2} show", 
            "Watch the {emotion3} flow",
            "",
            "From {emotion1} to light",
            "Through {emotion2} night",
            "In {emotion3} sight",
            "All becomes bright"
        ];

        let lyrics = enhancedTemplates.join('\n');
        const uniqueEmotions = [...new Set(emotions)];
        uniqueEmotions.forEach((emotion, index) => {
            lyrics = lyrics.replaceAll(`{emotion${index + 1}}`, emotion);
        });
        lyrics = lyrics.replace(/\{emotion\d+\}/g, 'peaceful');

        this.currentLyrics = lyrics;
        await this.generateMelodyForLyrics(); // Generate synchronized melody
        
        container.innerHTML = `
            <div style="border-left: 3px solid var(--warning-color); padding-left: 15px; margin-bottom: 10px;">
                <small style="color: var(--warning-color); font-weight: bold;">🎵 Enhanced Template Synchronized Lyrics</small>
            </div>
            <div style="white-space: pre-line; line-height: 1.8; font-style: italic;">${lyrics}</div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(255, 234, 167, 0.1); border-radius: 10px; font-size: 0.9em;">
                <strong>Musical Synchronization:</strong> Lyrics adapted for ${noteCount} notes with melodic phrasing
            </div>
        `;
    }

    toggleMusicSymphony() {
        if (this.isPlaying) {
            this.stopMusicSymphony();
        } else {
            this.playMusicSymphony();
        }
    }

    playMusicSymphony() {
        if (!this.musicTimeline || !this.audioContext) {
            alert('Please import a timeline first and ensure audio is enabled');
            return;
        }

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        
        // If starting fresh (not resuming), initialize positions
        if (this.currentlyPlayingIndex === undefined) {
            this.currentlyPlayingIndex = 0;
            this.currentSyllableIndex = 0;
            this.currentFrame = 0;
            this.stopAllOscillators(); // Only stop oscillators when starting fresh
        }
        
        // Update button states
        this.updatePlayButtonState();
        
        // Start background instruments with LLM enhancement
        this.startEnhancedBackgroundInstruments();
        
        this.renderMusicVisualization();
        this.playMusicSequence();
    }

    pauseMusicSymphony() {
        // This method is kept for compatibility but acts as stop
        this.stopMusicSymphony();
    }

    stopMusicSymphony() {
        this.isPlaying = false;
        this.stopAllOscillators();
        
        // Reset to beginning - clear all position tracking
        this.currentlyPlayingIndex = undefined;
        this.currentSyllableIndex = undefined;
        this.currentFrame = 0;
        
        // Update button states
        this.updatePlayButtonState();
        
        // Clear canvas
        if (this.musicCtx) {
            this.musicCtx.clearRect(0, 0, this.musicCanvas.width, this.musicCanvas.height);
        }
    }

    updatePlayButtonState() {
        const toggleBtn = document.getElementById('toggle-music');
        const icon = toggleBtn.querySelector('.btn-icon');
        const text = toggleBtn.querySelector('.btn-text');
        
        if (this.isPlaying) {
            icon.textContent = '⏹';
            text.textContent = 'Stop';
            toggleBtn.className = 'btn btn-danger';
        } else {
            icon.textContent = '▶';
            text.textContent = 'Play Symphony';
            toggleBtn.className = 'btn btn-primary';
        }
    }

    stopAllOscillators() {
        // Stop any currently playing oscillators
        if (this.currentOscillators) {
            this.currentOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            this.currentOscillators = [];
        }
        
        // Stop background instruments
        if (this.backgroundOscillators) {
            this.backgroundOscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            this.backgroundOscillators = [];
        }
    }

    updatePlaybackSpeed(speed) {
        this.playbackSpeed = parseFloat(speed);
        document.getElementById('speed-display').textContent = speed + 'x';
    }

    toggleBackgroundInstrument(instrument, enabled) {
        if (this.backgroundInstruments[instrument]) {
            this.backgroundInstruments[instrument].enabled = enabled;
            const volumeSlider = document.querySelector(`input[data-instrument="${instrument}"].instrument-volume`);
            if (volumeSlider) {
                volumeSlider.disabled = !enabled;
            }
            
            // If currently playing, immediately start/stop this instrument
            if (this.isPlaying) {
                if (enabled) {
                    // Start this specific instrument
                    this.startSingleBackgroundInstrument(instrument, this.backgroundInstruments[instrument]);
                } else {
                    // Stop this specific instrument
                    this.stopSingleBackgroundInstrument(instrument);
                }
            }
        }
    }

    updateInstrumentVolume(instrument, volume) {
        if (this.backgroundInstruments[instrument]) {
            this.backgroundInstruments[instrument].volume = parseFloat(volume) / 100;
            document.getElementById(`${instrument}-volume-display`).textContent = volume + '%';
        }
    }

    async startEnhancedBackgroundInstruments() {
        if (!this.audioContext || !this.isPlaying) return;

        // Stop any existing background instruments
        this.stopBackgroundInstruments();

        // Initialize background oscillators array
        this.backgroundOscillators = [];
        this.backgroundIntervals = [];

        // Show enhanced LLM status for background instruments
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            this.showLLMStatus('🎼 LLM Integration: Generating enhanced background instruments...', 'info');
        } else {
            this.showLLMStatus('🎼 Template Mode: Using predefined instrument patterns', 'warning');
        }

        // Generate LLM-enhanced patterns for enabled instruments
        const enabledInstruments = Object.entries(this.backgroundInstruments)
            .filter(([instrument, config]) => config.enabled);

        for (const [instrument, config] of enabledInstruments) {
            try {
                if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
                    const enhancedPattern = await this.generateLLMBackgroundPattern(instrument);
                    if (enhancedPattern) {
                        this.startLLMInstrumentPattern(instrument, config, enhancedPattern);
                        continue;
                    }
                }
                // Fallback to enhanced templates
                this.startInstrumentPattern(instrument, config);
            } catch (error) {
                console.warn(`LLM background pattern failed for ${instrument}:`, error);
                this.showLLMStatus(`⚠️ LLM failed for ${instrument}, using templates`, 'warning');
                this.startInstrumentPattern(instrument, config);
            }
        }

        this.showLLMStatus('✅ Background instruments ready!', 'success');
    }

    stopBackgroundInstruments() {
        if (this.backgroundOscillators) {
            this.backgroundOscillators.forEach(osc => {
                try {
                    if (osc.stop) osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.backgroundOscillators = [];
        }
        
        if (this.backgroundIntervals) {
            this.backgroundIntervals.forEach(interval => clearInterval(interval));
            this.backgroundIntervals = [];
        }
        
        // Clear instrument-specific tracking
        if (this.instrumentOscillators) {
            Object.values(this.instrumentOscillators).forEach(oscArray => {
                oscArray.forEach(osc => {
                    try {
                        if (osc.stop) osc.stop();
                    } catch (e) {
                        // Already stopped
                    }
                });
            });
            this.instrumentOscillators = {};
        }
        
        if (this.instrumentIntervals) {
            Object.values(this.instrumentIntervals).forEach(interval => clearInterval(interval));
            this.instrumentIntervals = {};
        }
    }

    startSingleBackgroundInstrument(instrument, config) {
        // Initialize tracking objects if needed
        if (!this.instrumentOscillators) this.instrumentOscillators = {};
        if (!this.instrumentIntervals) this.instrumentIntervals = {};
        
        // Stop existing instrument if running
        this.stopSingleBackgroundInstrument(instrument);
        
        // Start the specific instrument
        try {
            if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
                // Try LLM enhanced pattern
                this.generateLLMBackgroundPattern(instrument).then(enhancedPattern => {
                    if (enhancedPattern) {
                        this.startLLMInstrumentPattern(instrument, config, enhancedPattern);
                    } else {
                        this.startInstrumentPattern(instrument, config);
                    }
                }).catch(() => {
                    this.startInstrumentPattern(instrument, config);
                });
            } else {
                this.startInstrumentPattern(instrument, config);
            }
        } catch (error) {
            console.warn(`Failed to start ${instrument}:`, error);
        }
    }

    stopSingleBackgroundInstrument(instrument) {
        // Stop oscillators for this instrument
        if (this.instrumentOscillators && this.instrumentOscillators[instrument]) {
            this.instrumentOscillators[instrument].forEach(osc => {
                try {
                    if (osc.stop) osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.instrumentOscillators[instrument] = [];
        }
        
        // Stop intervals for this instrument
        if (this.instrumentIntervals && this.instrumentIntervals[instrument]) {
            clearInterval(this.instrumentIntervals[instrument]);
            delete this.instrumentIntervals[instrument];
        }
    }

    startInstrumentPattern(instrument, config) {
        const patterns = {
            drums: () => this.createDrumPattern(config.volume, instrument),
            bass: () => this.createBassPattern(config.volume, instrument),
            guitar: () => this.createGuitarPattern(config.volume, instrument),
            ambient: () => this.createAmbientPattern(config.volume, instrument)
        };

        if (patterns[instrument]) {
            patterns[instrument]();
        }
    }

    async generateLLMBackgroundPattern(instrument) {
        if (!this.llmSettings.apiKey || !this.musicTimeline) return null;

        const emotionContext = this.extractEmotionContext();
        const noteCount = this.getAllTimelineEntries().length;

        const prompt = `Generate a ${instrument} pattern for a consciousness-themed musical composition using cobordism and homotopy concepts.

Musical Context:
- Instrument: ${instrument}
- Total notes/measures: ${noteCount}
- Emotional themes: ${emotionContext.emotions.join(', ')}
- Tempo: 90 BPM, adjustable by playback speed

Mathematical Concepts:
- Cobordism: Smooth transitions between musical states/phrases
- Homotopy: Continuous deformation of rhythmic patterns that preserve musical identity

Requirements:
1. Create a pattern that evolves smoothly (cobordism principle)
2. Allow continuous variation while maintaining core identity (homotopy principle)
3. Synchronize with main melody notes
4. Consider emotional progression

Do not say anything and just return this JSON format:
{
  "pattern": [
    {"beat": 1, "intensity": 0.8, "variation": "kick"},
    {"beat": 2, "intensity": 0.6, "variation": "snare"},
    ...
  ],
  "evolution": {
    "phases": ["intro", "development", "climax", "resolution"],
    "transitions": ["smooth", "gradual", "flowing"]
  }
}

Create exactly ${Math.min(noteCount, 16)} beat patterns.`;

        try {
            const result = await this.generateLLMContent(prompt);
            if (result && result.pattern) {
                return result;
            }
        } catch (error) {
            console.warn('LLM background pattern generation failed:', error);
        }
        return null;
    }

    startLLMInstrumentPattern(instrument, config, llmPattern) {
        if (!llmPattern || !llmPattern.pattern) {
            this.startInstrumentPattern(instrument, config);
            return;
        }

        const baseBPM = 90;
        const adjustedBPM = baseBPM * this.playbackSpeed;
        const beatInterval = (60 / adjustedBPM) * 1000;
        
        let patternIndex = 0;
        
        const playLLMPattern = () => {
            if (!this.isPlaying) return;
            
            const currentPattern = llmPattern.pattern[patternIndex % llmPattern.pattern.length];
            const intensity = (currentPattern.intensity || 0.7) * config.volume;
            
            switch (instrument) {
                case 'drums':
                    this.playLLMDrumBeat(currentPattern, intensity);
                    break;
                case 'bass':
                    this.playLLMBassBeat(currentPattern, intensity);
                    break;
                case 'guitar':
                    this.playLLMGuitarBeat(currentPattern, intensity);
                    break;
                case 'ambient':
                    this.playLLMAmbientBeat(currentPattern, intensity);
                    break;
            }
            
            patternIndex++;
        };
        
        playLLMPattern();
        const interval = setInterval(playLLMPattern, beatInterval);
        this.backgroundIntervals.push(interval);
    }

    playLLMDrumBeat(pattern, volume) {
        const variation = pattern.variation || 'kick';
        const intensity = pattern.intensity || 0.7;
        
        switch (variation) {
            case 'kick':
                this.playKickDrum(volume * intensity);
                break;
            case 'snare':
                this.playSnare(volume * intensity * 0.8);
                break;
            case 'hihat':
                this.playHiHat(volume * intensity * 0.4);
                break;
            case 'combo':
                this.playKickDrum(volume * intensity);
                setTimeout(() => this.playHiHat(volume * intensity * 0.3), 100);
                break;
        }
    }

    playLLMBassBeat(pattern, volume) {
        const bassFreqs = [80, 90, 100, 85, 75, 95];
        const freqIndex = (pattern.beat - 1) % bassFreqs.length;
        const frequency = bassFreqs[freqIndex];
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        const intensity = pattern.intensity || 0.7;
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume * intensity * 0.8, this.audioContext.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);
        
        this.backgroundOscillators.push(osc);
    }

    createBassPattern(volume) {
    const emotionContext = this.extractEmotionContext();
    const emotion = emotionContext.emotion || 'calm'; // fallback
    const emotionScaleMap = {
        joy: 'major', happy: 'major', excited: 'lydian', calm: 'pentatonic', peaceful: 'pentatonic',
        sad: 'minor', anxious: 'minor', angry: 'blues', focused: 'dorian', confused: 'chromatic',
        love: 'major', grateful: 'major', surprised: 'mixolydian', scared: 'phrygian', tired: 'minor',
        lonely: 'minor', curious: 'dorian', hopeful: 'major', frustrated: 'blues', proud: 'lydian',
        embarrassed: 'minor', shy: 'pentatonic', energetic: 'mixolydian', relaxed: 'dorian',
        bored: 'minor', nostalgic: 'major', overwhelmed: 'chromatic', determined: 'dorian',
        disappointed: 'minor'
    };

    const scaleFrequencies = {
        major: [130.81, 164.81, 196.00, 261.63, 329.63, 392.00],
        minor: [130.81, 155.56, 174.61, 220.00, 261.63, 311.13],
        pentatonic: [130.81, 146.83, 174.61, 196.00, 220.00],
        blues: [130.81, 155.56, 164.81, 174.61, 196.00, 233.08],
        dorian: [130.81, 146.83, 164.81, 174.61, 196.00, 220.00],
        lydian: [130.81, 146.83, 164.81, 185.00, 196.00, 220.00],
        mixolydian: [130.81, 146.83, 164.81, 174.61, 196.00, 207.65],
        phrygian: [130.81, 138.59, 164.81, 174.61, 196.00, 220.00],
        chromatic: [130.81, 138.59, 146.83, 155.56, 164.81, 174.61]
    };

    const scaleName = emotionScaleMap[emotion] || 'major';
    const scale = scaleFrequencies[scaleName];

    // Shift scale down 1 or 2 octaves for bass (e.g., divide by 2 or 4)
    const bassFreqs = scale.map(freq => freq / 2).filter(f => f >= 40 && f <= 120);

    let beatIndex = 0;

    const playBassBeat = () => {
        if (!this.isPlaying) return;

        const frequency = bassFreqs[beatIndex % bassFreqs.length];

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.9, this.audioContext.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.8);

        this.backgroundOscillators.push(osc);
        beatIndex++;
    };

    const bassBPM = 60 * this.playbackSpeed;
    const bassInterval = (60 / bassBPM) * 1000;

    playBassBeat();
    const interval = setInterval(playBassBeat, bassInterval);
    this.backgroundIntervals.push(interval);
    }

    playLLMGuitarBeat(pattern, volume) {
    const chordProgressions = {
        major: [
            [130.8, 164.8, 196.0],
            [196.0, 246.9, 293.7],
            [174.6, 220.0, 261.6]
        ],
        minor: [
            [130.8, 155.6, 196.0],
            [146.8, 174.6, 220.0],
            [164.8, 196.0, 246.9]
        ],
        blues: [
            [130.8, 155.6, 174.6],
            [146.8, 174.6, 185.0],
            [164.8, 185.0, 196.0]
        ],
        pentatonic: [
            [130.8, 164.8, 196.0],
            [146.8, 185.0, 220.0],
            [174.6, 220.0, 261.6]
        ],
        lydian: [
            [130.8, 164.8, 185.0],
            [146.8, 185.0, 207.7],
            [164.8, 207.7, 233.1]
        ],
        phrygian: [
            [130.8, 155.6, 174.6],
            [146.8, 174.6, 196.0]
        ],
        wholeTone: [
            [130.8, 146.8, 164.8],
            [164.8, 185.0, 207.7]
        ]
    };

    const scale = pattern.scale || 'major'; // fallback to 'major'
    const progressions = chordProgressions[scale] || chordProgressions['major'];
    const chordIndex = (pattern.beat - 1) % progressions.length;
    const chord = progressions[chordIndex];
    const intensity = pattern.intensity || 0.7;

    chord.forEach((freq, i) => {
        setTimeout(() => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(volume * intensity * 0.7, this.audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);

            osc.start();
            osc.stop(this.audioContext.currentTime + 1.0);

            this.backgroundOscillators.push(osc);
        }, i * 50);
    });
    }

    playLLMAmbientBeat(pattern, volume) {
        const ambientFreqs = [220, 330, 440, 550, 660, 770];
        const freqIndex = (pattern.beat - 1) % ambientFreqs.length;
        const frequency = ambientFreqs[freqIndex];
        const intensity = pattern.intensity || 0.7;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.Q.setValueAtTime(1, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume * intensity, this.audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(volume * intensity * 0.7, this.audioContext.currentTime + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 2.0);
        
        this.backgroundOscillators.push(osc);
    }

    createDrumPattern(volume, instrument = 'drums') {
        const baseBPM = 90;
        const adjustedBPM = baseBPM * this.playbackSpeed;
        const beatInterval = (60 / adjustedBPM) * 1000;
        
        let beatCount = 0;
        
        // Initialize tracking for this instrument
        if (!this.instrumentOscillators) this.instrumentOscillators = {};
        if (!this.instrumentIntervals) this.instrumentIntervals = {};
        if (!this.instrumentOscillators[instrument]) this.instrumentOscillators[instrument] = [];
        
        const enhancedPatterns = [
            { kick: true, snare: false, hihat: true },    // Beat 1
            { kick: false, snare: true, hihat: true },    // Beat 2
            { kick: true, snare: false, hihat: true },    // Beat 3
            { kick: false, snare: true, hihat: true },    // Beat 4
        ];
        
        const playDrumPattern = () => {
            if (!this.isPlaying || !this.backgroundInstruments[instrument]?.enabled) return;
            
            const pattern = enhancedPatterns[beatCount % 4];
            
            if (pattern.kick) this.playKickDrum(volume, instrument);
            if (pattern.snare) this.playSnare(volume * 0.8, instrument);
            if (pattern.hihat) this.playHiHat(volume * 0.4, instrument);
            
            beatCount++;
        };
        
        playDrumPattern();
        const interval = setInterval(playDrumPattern, beatInterval);
        this.instrumentIntervals[instrument] = interval;
    }
    
    playKickDrum(volume, instrument = 'drums') {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(60, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.1);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
        
        // Track by instrument
        if (this.instrumentOscillators && this.instrumentOscillators[instrument]) {
            this.instrumentOscillators[instrument].push(osc);
        } else {
            this.backgroundOscillators.push(osc);
        }
    }
    
    playSnare(volume, instrument = 'drums') {
        const osc = this.audioContext.createOscillator();
        const noise = this.audioContext.createBufferSource();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Create noise buffer for snare
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        noise.start();
        noise.stop(this.audioContext.currentTime + 0.1);
        
        // Track by instrument
        if (this.instrumentOscillators && this.instrumentOscillators[instrument]) {
            this.instrumentOscillators[instrument].push(noise);
        } else {
            this.backgroundOscillators.push(noise);
        }
    }
    
    playHiHat(volume, instrument = 'drums') {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(10000, this.audioContext.currentTime);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(8000, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
        
        // Track by instrument
        if (this.instrumentOscillators && this.instrumentOscillators[instrument]) {
            this.instrumentOscillators[instrument].push(osc);
        } else {
            this.backgroundOscillators.push(osc);
        }
    }

    createBassPattern(volume, instrument = 'bass') {
        const bassNotes = [80, 90, 100, 85]; // Bass frequencies
        let noteIndex = 0;
        const noteInterval = (60 / 90) / this.playbackSpeed; // 90 BPM adjusted for speed
        
        // Initialize tracking for this instrument
        if (!this.instrumentOscillators) this.instrumentOscillators = {};
        if (!this.instrumentIntervals) this.instrumentIntervals = {};
        if (!this.instrumentOscillators[instrument]) this.instrumentOscillators[instrument] = [];
        
        const playBass = () => {
            if (!this.isPlaying || !this.backgroundInstruments[instrument]?.enabled) return;
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(bassNotes[noteIndex], this.audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.5);
            
            this.instrumentOscillators[instrument].push(osc);
            
            noteIndex = (noteIndex + 1) % bassNotes.length;
        };
        
        playBass();
        const interval = setInterval(playBass, noteInterval * 1000);
        this.instrumentIntervals[instrument] = interval;
    }

    createGuitarPattern(volume) {
    const emotionContext = this.extractEmotionContext(); // e.g., { emotion: 'joy', scales: ['major'] }
    const scales = emotionContext.scales;

    // Full scale to frequency map
    const scaleFrequencies = {
        major:      [130.81, 164.81, 196.00, 261.63, 329.63, 392.00],
        minor:      [130.81, 155.56, 174.61, 220.00, 261.63, 311.13],
        pentatonic: [130.81, 146.83, 174.61, 196.00, 220.00],
        blues:      [130.81, 155.56, 164.81, 174.61, 196.00, 233.08],
        dorian:     [130.81, 146.83, 164.81, 174.61, 196.00, 220.00],
        lydian:     [130.81, 146.83, 164.81, 185.00, 196.00, 220.00],
        mixolydian: [130.81, 146.83, 164.81, 174.61, 196.00, 207.65],
        phrygian:   [130.81, 138.59, 164.81, 174.61, 196.00, 220.00],
        chromatic:  [130.81, 138.59, 146.83, 155.56, 164.81, 174.61]
    };

    // Build chord list using selected scales
    const chordFreqs = scales.flatMap(scale => {
        const freqs = scaleFrequencies[scale];
        if (!freqs) return [];
        
        const chords = [];
        for (let i = 0; i < freqs.length - 2; i++) {
            chords.push([freqs[i], freqs[i + 1], freqs[i + 2]]);
        }
        return chords;
    });

    let chordIndex = 0;
    const strumInterval = (60 / 60) / this.playbackSpeed; // BPM adjusted for speed

    const playChord = () => {
        if (!this.isPlaying || chordFreqs.length === 0) return;

        const chord = chordFreqs[chordIndex];

        chord.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(volume * 0.7, this.audioContext.currentTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);

                osc.start();
                osc.stop(this.audioContext.currentTime + 1.0);

                this.backgroundOscillators.push(osc);
            }, i * 50); // Slight strum delay
        });

        chordIndex = (chordIndex + 1) % chordFreqs.length;
        setTimeout(playChord, strumInterval * 1000);
    };

    playChord();
    }

    createAmbientPattern(volume) {
    const emotionContext = this.extractEmotionContext(); // { emotion: 'hope', scales: ['lydian'] }
    const scales = emotionContext.scales;

    // Scale definitions with ambient-friendly smooth tones
    const scaleFrequencies = {
        major:      [130.81, 164.81, 196.00, 261.63, 329.63, 392.00],
        minor:      [130.81, 155.56, 174.61, 220.00, 261.63, 311.13],
        pentatonic: [130.81, 146.83, 174.61, 196.00, 220.00],
        blues:      [130.81, 155.56, 164.81, 174.61, 196.00, 233.08],
        dorian:     [130.81, 146.83, 164.81, 174.61, 196.00, 220.00],
        lydian:     [130.81, 146.83, 164.81, 185.00, 196.00, 220.00],
        mixolydian: [130.81, 146.83, 164.81, 174.61, 196.00, 207.65],
        phrygian:   [130.81, 138.59, 164.81, 174.61, 196.00, 220.00],
        chromatic:  [130.81, 138.59, 146.83, 155.56, 164.81, 174.61]
    };

    // Build ambient frequencies from selected scale(s)
    const ambientFreqs = scales.flatMap(scale => {
        const freqs = scaleFrequencies[scale];
        return freqs ? freqs.slice(1, 5) : []; // Grab a calm mid-range set
    });

    if (ambientFreqs.length === 0) return; // Don't play if no scale matched

    let freqIndex = 0;
    const ambientInterval = (60 / 30) / this.playbackSpeed; // 30 BPM adjusted

    const playAmbient = () => {
        if (!this.isPlaying) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(ambientFreqs[freqIndex], this.audioContext.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.Q.setValueAtTime(1, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(volume * 0.7, this.audioContext.currentTime + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2.0);

        osc.start();
        osc.stop(this.audioContext.currentTime + 2.0);

        this.backgroundOscillators.push(osc);

        freqIndex = (freqIndex + 1) % ambientFreqs.length;
        setTimeout(playAmbient, ambientInterval * 1000);
    };

    playAmbient();
    }

    renderMusicVisualization() {
        if (!this.musicCtx || !this.isPlaying) return;

        this.musicCtx.clearRect(0, 0, this.musicCanvas.width, this.musicCanvas.height);

        // Draw background
        const gradient = this.musicCtx.createLinearGradient(0, 0, this.musicCanvas.width, this.musicCanvas.height);
        gradient.addColorStop(0, '#000428');
        gradient.addColorStop(1, '#004e92');
        this.musicCtx.fillStyle = gradient;
        this.musicCtx.fillRect(0, 0, this.musicCanvas.width, this.musicCanvas.height);

        // Extract all entries from timeline (handle both single day and date range)
        const allEntries = [];
        const timeline = this.musicTimeline.timeline;
        
        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                // Date range structure
                Object.entries(timeline).forEach(([date, dayData]) => {
                    Object.entries(dayData).forEach(([hour, entry]) => {
                        if (entry && entry.dot) {
                            allEntries.push({ date, hour: parseInt(hour), entry });
                        }
                    });
                });
            } else {
                // Single day structure
                Object.entries(timeline).forEach(([hour, entry]) => {
                    if (entry && entry.dot) {
                        allEntries.push({ hour: parseInt(hour), entry });
                    }
                });
            }
        }

        if (allEntries.length === 0) return;

        const canvasWidth = this.musicCanvas.width;
        const canvasHeight = this.musicCanvas.height;

        // Title
        this.musicCtx.fillStyle = 'white';
        this.musicCtx.font = 'bold 24px Inter';
        this.musicCtx.textAlign = 'center';
        this.musicCtx.fillText('🎵 Consciousness Symphony 🎵', canvasWidth / 2, 30);

        // Display synchronized lyrics if available
        if (this.currentLyrics && this.currentlyPlayingIndex !== undefined) {
            const lyricsLines = this.currentLyrics.split('\n').filter(line => line.trim());
            
            // For synchronized melody, show current syllable
            if (this.synchronizedMelody && this.currentSyllableIndex !== undefined) {
                const currentNote = this.synchronizedMelody[this.currentSyllableIndex];
                const currentSyllable = currentNote?.syllable;
                
                if (currentSyllable) {
                    // Enhanced lyrics background with gradient
                    const lyricsGradient = this.musicCtx.createLinearGradient(50, canvasHeight - 140, 50, canvasHeight - 20);
                    lyricsGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
                    lyricsGradient.addColorStop(1, 'rgba(30, 60, 114, 0.8)');
                    this.musicCtx.fillStyle = lyricsGradient;
                    this.musicCtx.fillRect(50, canvasHeight - 140, canvasWidth - 100, 120);
                    
                    // Lyrics border
                    this.musicCtx.strokeStyle = '#FFD700';
                    this.musicCtx.lineWidth = 2;
                    this.musicCtx.strokeRect(50, canvasHeight - 140, canvasWidth - 100, 120);
                    
                    // Show current line with highlighted syllable
                    const currentLine = lyricsLines[currentSyllable.lineIndex];
                    if (currentLine) {
                        this.musicCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        this.musicCtx.font = '18px Inter';
                        this.musicCtx.textAlign = 'center';
                        this.musicCtx.fillText(currentLine.trim(), canvasWidth / 2, canvasHeight - 95);
                        
                        // Highlight current syllable/word
                        if (currentSyllable.text) {
                            this.musicCtx.fillStyle = '#FFD700';
                            this.musicCtx.font = 'bold 24px Inter';
                            this.musicCtx.fillText(`♪ ${currentSyllable.text} ♪`, canvasWidth / 2, canvasHeight - 65);
                        }
                        
                        // Show synchronization info
                        this.musicCtx.fillStyle = 'rgba(78, 205, 196, 0.8)';
                        this.musicCtx.font = '12px Inter';
                        this.musicCtx.fillText(
                            `Syllable ${this.currentSyllableIndex + 1} of ${this.synchronizedMelody.length} | Note: ${Math.round(currentNote.frequency)}Hz`,
                            canvasWidth / 2,
                            canvasHeight - 35
                        );
                        
                        // Progress bar for syllables
                        const progressWidth = canvasWidth - 120;
                        const progressX = 60;
                        const progressY = canvasHeight - 45;
                        
                        this.musicCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        this.musicCtx.fillRect(progressX, progressY, progressWidth, 4);
                        
                        const progressPercent = this.currentSyllableIndex / this.synchronizedMelody.length;
                        this.musicCtx.fillStyle = '#4ecdc4';
                        this.musicCtx.fillRect(progressX, progressY, progressWidth * progressPercent, 4);
                    }
                }
            } else {
                // Fallback to line-based display
                const totalEntries = this.totalPlayingEntries || allEntries.length;
                const currentLineIndex = Math.min(this.currentlyPlayingIndex, lyricsLines.length - 1);
                
                if (currentLineIndex >= 0 && currentLineIndex < lyricsLines.length && lyricsLines[currentLineIndex].trim()) {
                    // Enhanced lyrics background with gradient
                    const lyricsGradient = this.musicCtx.createLinearGradient(50, canvasHeight - 120, 50, canvasHeight - 40);
                    lyricsGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
                    lyricsGradient.addColorStop(1, 'rgba(30, 60, 114, 0.8)');
                    this.musicCtx.fillStyle = lyricsGradient;
                    this.musicCtx.fillRect(50, canvasHeight - 120, canvasWidth - 100, 80);
                    
                    // Lyrics border
                    this.musicCtx.strokeStyle = '#FFD700';
                    this.musicCtx.lineWidth = 2;
                    this.musicCtx.strokeRect(50, canvasHeight - 120, canvasWidth - 100, 80);
                    
                    // Current lyrics line
                    this.musicCtx.fillStyle = '#FFD700';
                    this.musicCtx.font = 'bold 20px Inter';
                    this.musicCtx.textAlign = 'center';
                    this.musicCtx.fillText(lyricsLines[currentLineIndex].trim(), canvasWidth / 2, canvasHeight - 75);
                    
                    // Progress indicator
                    this.musicCtx.fillStyle = 'rgba(255, 215, 0, 0.5)';
                    this.musicCtx.font = '12px Inter';
                    this.musicCtx.fillText(`Line ${currentLineIndex + 1} of ${lyricsLines.length}`, canvasWidth / 2, canvasHeight - 50);
                    
                    // Show next line preview if available
                    if (currentLineIndex + 1 < lyricsLines.length) {
                        this.musicCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                        this.musicCtx.font = '14px Inter';
                        this.musicCtx.fillText(`Next: ${lyricsLines[currentLineIndex + 1].trim()}`, canvasWidth / 2, canvasHeight - 95);
                    }
                }
            }
        }

        // Draw timeline entries
        allEntries.forEach((item, index) => {
            const { entry, hour, date } = item;
            const dot = entry.dot;
            
            const x = 50 + (index / Math.max(allEntries.length - 1, 1)) * (canvasWidth - 100);
            const baseY = canvasHeight / 2;
            const waveY = baseY + Math.sin(Date.now() * 0.003 + index * 0.5) * 60;

            // Draw connecting line for flow
            if (index > 0) {
                const prevX = 50 + ((index - 1) / Math.max(allEntries.length - 1, 1)) * (canvasWidth - 100);
                const prevY = baseY + Math.sin(Date.now() * 0.003 + (index - 1) * 0.5) * 60;
                
                this.musicCtx.strokeStyle = 'rgba(78, 205, 196, 0.6)';
                this.musicCtx.lineWidth = 2;
                this.musicCtx.beginPath();
                this.musicCtx.moveTo(prevX, prevY);
                this.musicCtx.lineTo(x, waveY);
                this.musicCtx.stroke();
            }

            // Draw dot with enhanced emoji-like representation
            const pulseScale = 1 + Math.sin(Date.now() * 0.008 + index) * 0.4;
            const radius = 25 * pulseScale;

            // Glow effect
            this.musicCtx.shadowColor = dot.color;
            this.musicCtx.shadowBlur = 25;
            this.musicCtx.fillStyle = dot.color;
            this.musicCtx.beginPath();
            this.musicCtx.arc(x, waveY, radius, 0, Math.PI * 2);
            this.musicCtx.fill();
            this.musicCtx.shadowBlur = 0;

            // Dot border
            this.musicCtx.strokeStyle = 'white';
            this.musicCtx.lineWidth = 3;
            this.musicCtx.beginPath();
            this.musicCtx.arc(x, waveY, radius, 0, Math.PI * 2);
            this.musicCtx.stroke();

            // Dot emoji/initial
            this.musicCtx.fillStyle = 'white';
            this.musicCtx.font = 'bold 16px Inter';
            this.musicCtx.textAlign = 'center';
            this.musicCtx.textBaseline = 'middle';
            this.musicCtx.fillText(dot.name.charAt(0).toUpperCase(), x, waveY);

            // Hour label below
            this.musicCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.musicCtx.font = '12px Inter';
            this.musicCtx.fillText(`${hour}:00`, x, waveY + radius + 15);

            // Dot name above
            this.musicCtx.fillStyle = dot.color;
            this.musicCtx.font = 'bold 14px Inter';
            this.musicCtx.fillText(dot.name, x, waveY - radius - 15);
        });

        // Playing indicator
        if (this.currentlyPlayingIndex !== undefined && this.currentlyPlayingIndex < allEntries.length) {
            const x = 50 + (this.currentlyPlayingIndex / Math.max(allEntries.length - 1, 1)) * (canvasWidth - 100);
            const baseY = canvasHeight / 2;
            const waveY = baseY + Math.sin(Date.now() * 0.003 + this.currentlyPlayingIndex * 0.5) * 60;
            
            // Highlight currently playing dot
            this.musicCtx.strokeStyle = '#FFD700';
            this.musicCtx.lineWidth = 5;
            this.musicCtx.beginPath();
            this.musicCtx.arc(x, waveY, 35, 0, Math.PI * 2);
            this.musicCtx.stroke();
        }

        if (this.isPlaying) {
            requestAnimationFrame(() => this.renderMusicVisualization());
        }
    }

    async playMusicSequence() {
        if (!this.audioContext || !this.isPlaying) return;

        // Initialize oscillators array
        this.currentOscillators = this.currentOscillators || [];

        // Generate LLM-enhanced melody with cobordism/homotopy if possible
        if (this.llmSettings.apiKey && this.llmSettings.apiKey.trim() !== '') {
            try {
                this.showLLMStatus('🎼 Generating mathematical melody...', 'info');
                const enhancedMelody = await this.generateLLMEnhancedMelody();
                if (enhancedMelody) {
                    this.synchronizedMelody = enhancedMelody;
                    this.showLLMStatus('✅ Mathematical melody ready!', 'success');
                }
            } catch (error) {
                console.warn('LLM melody generation failed:', error);
                this.showLLMStatus('⚠️ AI melody failed, using templates', 'warning');
            }
        }

        // Use synchronized melody if available, otherwise fall back to timeline entries
        if (this.synchronizedMelody && this.synchronizedMelody.length > 0) {
            this.playSynchronizedMelody();
            return;
        }

        // Extract all entries from timeline (fallback)
        const allEntries = [];
        const timeline = this.musicTimeline.timeline;
        
        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                // Date range structure
                Object.entries(timeline).forEach(([date, dayData]) => {
                    Object.entries(dayData).forEach(([hour, entry]) => {
                        if (entry && entry.dot) {
                            allEntries.push({ date, hour: parseInt(hour), entry });
                        }
                    });
                });
            } else {
                // Single day structure
                Object.entries(timeline).forEach(([hour, entry]) => {
                    if (entry && entry.dot) {
                        allEntries.push({ hour: parseInt(hour), entry });
                    }
                });
            }
        }

        if (allEntries.length === 0) {
            alert('No musical entries found in timeline');
            return;
        }

        // Prepare lyrics synchronization
        const lyricsLines = this.currentLyrics ? this.currentLyrics.split('\n').filter(line => line.trim()) : [];
        let expandedEntries = [...allEntries];

        // If we have more lyrics than entries, expand entries to match lyrics
        if (lyricsLines.length > allEntries.length) {
            const repetitions = Math.ceil(lyricsLines.length / allEntries.length);
            expandedEntries = [];
            for (let rep = 0; rep < repetitions; rep++) {
                allEntries.forEach(entry => {
                    expandedEntries.push({
                        ...entry,
                        repetition: rep,
                        originalIndex: allEntries.indexOf(entry)
                    });
                });
                if (expandedEntries.length >= lyricsLines.length) break;
            }
            expandedEntries = expandedEntries.slice(0, lyricsLines.length);
        }

        let currentIndex = 0;
        this.currentlyPlayingIndex = 0;
        this.totalPlayingEntries = expandedEntries.length;

        const playNext = () => {
            if (!this.isPlaying || currentIndex >= expandedEntries.length) {
                this.currentlyPlayingIndex = undefined;
                this.stopMusicSymphony();
                return;
            }

            const currentEntry = expandedEntries[currentIndex];
            this.currentlyPlayingIndex = currentIndex;

            if (currentEntry && currentEntry.entry && currentEntry.entry.dot) {
                // Create varied melody by adjusting frequency based on repetition and position
                const baseNote = this.getEnhancedNoteForDot(currentEntry.entry.dot, currentEntry.repetition || 0, currentIndex);
                this.playEnhancedDotNote(currentEntry.entry.dot, baseNote, currentIndex);
            }

            currentIndex++;
            const adjustedDelay = 1000 / this.playbackSpeed; // Adjust timing based on speed
            setTimeout(playNext, adjustedDelay);
        };

        playNext();
    }

    playSynchronizedMelody() {
        let currentIndex = 0;
        this.currentlyPlayingIndex = 0;
        this.totalPlayingEntries = this.synchronizedMelody.length;
        this.currentSyllableIndex = 0;

        const playNext = () => {
            if (!this.isPlaying || currentIndex >= this.synchronizedMelody.length) {
                this.currentlyPlayingIndex = undefined;
                this.currentSyllableIndex = undefined;
                this.stopMusicSymphony();
                return;
            }

            const currentNote = this.synchronizedMelody[currentIndex];
            this.currentlyPlayingIndex = currentIndex;
            this.currentSyllableIndex = currentIndex;

            // Play the synchronized note
            this.playSynchronizedNote(currentNote, currentIndex);

            currentIndex++;
            // Use the note's duration for timing, with a minimum duration, adjusted for speed
            const nextDelay = Math.max(currentNote.duration * 1000, 400) / this.playbackSpeed;
            setTimeout(playNext, nextDelay);
        };

        playNext();
    }

    playSynchronizedNote(noteData, position) {
        if (!this.audioContext) return;

        try {
            const frequency = noteData.frequency || 440;
            const duration = noteData.duration || 0.8;
            const emotion = noteData.emotion || 'neutral';

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();

            // Store oscillator for cleanup
            this.currentOscillators = this.currentOscillators || [];
            this.currentOscillators.push(oscillator);

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Set waveform based on emotion
            const emotionWaveforms = {
                'beginning': 'sine',
                'development': 'triangle',
                'resolution': 'sawtooth',
                'neutral': 'sine'
            };

            oscillator.type = emotionWaveforms[emotion] || 'sine';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Enhanced filter for emotional expression
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(frequency * 2.5, this.audioContext.currentTime);
            filterNode.Q.setValueAtTime(emotion === 'development' ? 2 : 1, this.audioContext.currentTime);

            // Dynamic volume based on syllable importance
            const volume = noteData.syllable?.text ? 0.6 : 0.4; // Louder for word starts

            // Musical envelope with emotional expression
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(volume * 0.7, this.audioContext.currentTime + duration * 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            // Add subtle vibrato for expressiveness
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.frequency.setValueAtTime(4, this.audioContext.currentTime);
            lfoGain.gain.setValueAtTime(1.5, this.audioContext.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start(this.audioContext.currentTime);
            lfo.stop(this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);

            // Clean up oscillator after it stops
            setTimeout(() => {
                const index = this.currentOscillators.indexOf(oscillator);
                if (index > -1) {
                    this.currentOscillators.splice(index, 1);
                }
            }, duration * 1000 + 100);

        } catch (e) {
            console.warn('Could not play synchronized note:', e);
        }
    }

    getEnhancedNoteForDot(dot, repetition = 0, position = 0) {
        const mapping = this.musicMapping && this.musicMapping.has(dot.id) 
            ? this.musicMapping.get(dot.id) 
            : {
                scale: this.getScaleFromEmotion(this.getEmotionFromDot(dot)),
                volume: 70,
                noteLength: 'half',
                instrument: 'piano'
            };

        const scale = this.scales[mapping.scale] || this.scales.major;
        
        // Create melody variation based on repetition and position
        let noteIndex = Math.abs(dot.name.charCodeAt(0)) % scale.length;
        
        // Add melodic progression for repetitions
        if (repetition > 0) {
            // Move up or down the scale for variations
            const variation = (repetition % 3) - 1; // -1, 0, 1
            noteIndex = Math.max(0, Math.min(scale.length - 1, noteIndex + variation));
        }
        
        // Add slight progression throughout the song
        const progressionOffset = Math.floor(position / 4) % 3; // Change every 4 notes
        noteIndex = (noteIndex + progressionOffset) % scale.length;
        
        return scale[noteIndex];
    }

    playEnhancedDotNote(dot, frequency, position = 0) {
        if (!this.audioContext) return;

        try {
            const mapping = this.musicMapping && this.musicMapping.has(dot.id) 
                ? this.musicMapping.get(dot.id) 
                : {
                    scale: this.getScaleFromEmotion(this.getEmotionFromDot(dot)),
                    volume: 70,
                    noteLength: 'half',
                    instrument: 'piano'
                };

            const volume = mapping.volume / 100;
            const duration = mapping.noteLength === 'quarter' ? 0.8 : mapping.noteLength === 'half' ? 1.0 : 1.5;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();

            // Store oscillator for cleanup
            this.currentOscillators = this.currentOscillators || [];
            this.currentOscillators.push(oscillator);

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Enhanced waveforms and effects
            const waveforms = {
                piano: 'triangle',
                guitar: 'sawtooth',
                synth: 'square',
                flute: 'sine',
                strings: 'sawtooth',
                drums: 'square',
                bass: 'triangle',
                bells: 'sine',
                harp: 'triangle'
            };

            oscillator.type = waveforms[mapping.instrument] || 'sine';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Add filter effects for richer sound
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(frequency * 3, this.audioContext.currentTime);
            filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);

            // Enhanced envelope with musical phrasing
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.7, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(volume * 0.5, this.audioContext.currentTime + duration * 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            // Add slight vibrato for more musical expression
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.frequency.setValueAtTime(5, this.audioContext.currentTime); // 5Hz vibrato
            lfoGain.gain.setValueAtTime(2, this.audioContext.currentTime); // Small pitch variation
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start(this.audioContext.currentTime);
            lfo.stop(this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);

            // Clean up oscillator after it stops
            setTimeout(() => {
                const index = this.currentOscillators.indexOf(oscillator);
                if (index > -1) {
                    this.currentOscillators.splice(index, 1);
                }
            }, duration * 1000 + 100);

        } catch (e) {
            console.warn('Could not play note:', e);
        }
    }

    playDotNote(dot) {
        if (!this.audioContext) return;

        try {
            // Get mapping if it exists
            const mapping = this.musicMapping && this.musicMapping.has(dot.id) 
                ? this.musicMapping.get(dot.id) 
                : {
                    scale: this.getScaleFromEmotion(this.getEmotionFromDot(dot)),
                    volume: 70,
                    noteLength: 'half',
                    instrument: 'piano'
                };

            const scale = this.scales[mapping.scale] || this.scales.major;
            const volume = mapping.volume / 100;
            const duration = mapping.noteLength === 'quarter' ? 0.6 : mapping.noteLength === 'half' ? 1.0 : 1.8;

            // Choose frequency based on dot properties
            const freqIndex = Math.abs(dot.name.charCodeAt(0)) % scale.length;
            const frequency = scale[freqIndex];

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Store oscillator for cleanup
            this.currentOscillators = this.currentOscillators || [];
            this.currentOscillators.push(oscillator);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Set waveform based on instrument from mapping
            const waveforms = {
                piano: 'triangle',
                guitar: 'sawtooth',
                synth: 'square',
                flute: 'sine',
                strings: 'sawtooth',
                drums: 'square',
                bass: 'triangle',
                bells: 'sine',
                harp: 'triangle'
            };

            oscillator.type = waveforms[mapping.instrument] || 'sine';
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Improved envelope for better audio
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.6, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(volume * 0.4, this.audioContext.currentTime + duration * 0.7);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);

            // Clean up oscillator after it stops
            setTimeout(() => {
                const index = this.currentOscillators.indexOf(oscillator);
                if (index > -1) {
                    this.currentOscillators.splice(index, 1);
                }
            }, duration * 1000 + 100);

        } catch (e) {
            console.warn('Could not play note:', e);
        }
    }

    exportMIDI() {
        if (!this.musicTimeline) {
            alert('Please import a timeline first');
            return;
        }

        // Generate a simple MIDI-like representation
        const midiData = {
            format: 'Simple MIDI Data',
            timeline: this.musicTimeline,
            mapping: this.musicMapping ? Object.fromEntries(this.musicMapping) : {},
            generated: new Date().toISOString(),
            notes: []
        };

        // Extract notes from timeline
        const timeline = this.musicTimeline.timeline;
        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                // Date range structure
                Object.entries(timeline).forEach(([date, dayData]) => {
                    Object.entries(dayData).forEach(([hour, entry]) => {
                        if (entry && entry.dot) {
                            const mapping = this.musicMapping.get(entry.dot.id) || {};
                            const scale = this.scales[mapping.scale] || this.scales.major;
                            const frequency = scale[Math.abs(entry.dot.name.charCodeAt(0)) % scale.length];
                            
                            midiData.notes.push({
                                time: `${date} ${hour}:00`,
                                note: entry.dot.name,
                                frequency: frequency,
                                instrument: mapping.instrument || 'piano',
                                duration: mapping.noteLength || 'half'
                            });
                        }
                    });
                });
            }
        }

        const blob = new Blob([JSON.stringify(midiData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consciousness-symphony-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('MIDI data exported as JSON! Use a MIDI converter tool to create actual MIDI files.');
    }

    exportSheet() {
        if (!this.musicTimeline) {
            alert('Please import a timeline first');
            return;
        }

        // Generate sheet music representation as HTML
        const sheetContent = this.generateSheetMusic();
        
        // Show preview modal
        this.showSheetMusicPreview(sheetContent);
    }

    showSheetMusicPreview(sheetContent) {
        // Create modal for sheet music preview
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            overflow-y: auto;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            max-width: 95%;
            max-height: 95%;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        // Add controls
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: sticky;
            top: 0;
            background: white;
            padding: 15px 20px;
            border-bottom: 2px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 15px 15px 0 0;
            z-index: 10;
        `;

        controls.innerHTML = `
            <h3 style="margin: 0; color: #333;">🎼 Sheet Music Preview</h3>
            <div style="display: flex; gap: 10px;">
                <button id="print-sheet" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">🖨️ Print</button>
                <button id="download-sheet" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">💾 Download PDF</button>
                <button id="close-sheet-preview" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">✕ Close</button>
            </div>
        `;

        // Add sheet content
        const sheetDiv = document.createElement('div');
        sheetDiv.innerHTML = sheetContent;
        sheetDiv.style.cssText = `
            padding: 20px;
            background: white;
            color: #333;
        `;

        content.appendChild(controls);
        content.appendChild(sheetDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('close-sheet-preview').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('print-sheet').addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Consciousness Symphony Sheet Music</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; margin: 20px; color: #000; }
                        @media print { 
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${sheetContent}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });

        document.getElementById('download-sheet').addEventListener('click', () => {
            const blob = new Blob([`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Consciousness Symphony Sheet Music</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; margin: 40px; color: #000; }
                        .staff { border-bottom: 5px solid #000; margin: 30px 0; position: relative; height: 100px; }
                        .note { position: absolute; width: 20px; height: 20px; background: #000; border-radius: 50%; }
                        .measure { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
                        h1 { text-align: center; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f8f9fa; font-weight: bold; }
                    </style>
                </head>
                <body>
                    ${sheetContent}
                </body>
                </html>
            `], { type: 'text/html' });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `consciousness-sheet-music-${Date.now()}.html`;
            a.click();
            URL.revokeObjectURL(url);
            alert('Sheet music downloaded successfully! Open in browser and use browser\'s print-to-PDF for PDF format.');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    async exportVideo() {
        if (!this.musicTimeline) {
            alert('Please import a timeline first');
            return;
        }

        // Create and show enhanced video export modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;

        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 2px solid var(--primary-color);
            border-radius: 20px;
            padding: 20px;
            width: 95%;
            max-width: 1200px;
            height: 95%;
            display: flex;
            flex-direction: column;
            color: white;
            overflow-y: auto;
            
            @media (max-width: 768px) {
                width: 98%;
                height: 98%;
                padding: 15px;
                border-radius: 15px;
            }
            
            @media (max-width: 480px) {
                width: 100%;
                height: 100vh;
                padding: 10px;
                border-radius: 10px;
            }
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--glass-border);
        `;

        header.innerHTML = `
            <h2 style="color: var(--primary-color); margin: 0;">🎬 Consciousness Symphony Video Export</h2>
            <button id="close-video" class="btn btn-danger" style="padding: 8px 16px;">✕ Close</button>
        `;

        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        canvas.style.cssText = `
            width: 100%;
            height: auto;
            max-height: 60vh;
            border-radius: 10px;
            background: linear-gradient(45deg, #000428, #004e92);
            border: 1px solid var(--glass-border);
        `;

        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 15px 0;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        `;

        controls.innerHTML = `
            <button id="play-animation" class="btn btn-primary" style="padding: 8px 16px;">▶️ Play</button>
            <button id="pause-animation" class="btn btn-secondary" style="padding: 8px 16px; display: none;">⏸️ Pause</button>
            <div style="flex: 1; height: 8px; background: rgba(255, 255, 255, 0.2); border-radius: 4px; cursor: pointer;" id="video-progress">
                <div id="video-progress-bar" style="height: 100%; background: var(--primary-color); border-radius: 4px; width: 0%; transition: width 0.1s;"></div>
            </div>
            <span id="video-time" style="font-size: 0.9em;">0:00 / 0:00</span>
        `;

        const exportOptions = document.createElement('div');
        exportOptions.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
            padding: 15px;
            background: rgba(78, 205, 196, 0.1);
            border-radius: 10px;
            border: 1px solid var(--primary-color);
            
            @media (max-width: 768px) {
                grid-template-columns: 1fr;
                gap: 10px;
                padding: 10px;
            }
        `;

        exportOptions.innerHTML = `
            <button id="download-webm" class="btn btn-success" style="width: 100%; font-size: clamp(0.8rem, 2vw, 1rem);">📥 Download Video (WebM)</button>
            <button id="download-gif" class="btn btn-warning" style="width: 100%; font-size: clamp(0.8rem, 2vw, 1rem);">🎞️ Download as GIF</button>
            <button id="record-screen" class="btn btn-primary" style="width: 100%; font-size: clamp(0.8rem, 2vw, 1rem);">📹 Record Full Quality</button>
            <button id="share-video" class="btn btn-secondary" style="width: 100%; font-size: clamp(0.8rem, 2vw, 1rem);">🌐 Share on Social Media</button>
        `;

        videoContainer.appendChild(header);
        videoContainer.appendChild(canvas);
        videoContainer.appendChild(controls);
        videoContainer.appendChild(exportOptions);
        modal.appendChild(videoContainer);
        document.body.appendChild(modal);

        // Animation variables
        const ctx = canvas.getContext('2d');
        let animationFrame = 0;
        let isAnimating = false;
        let animationId = null;

        // Extract timeline data
        const allEntries = [];
        const timeline = this.musicTimeline.timeline;
        
        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                Object.entries(timeline).forEach(([date, dayData]) => {
                    Object.entries(dayData).forEach(([hour, entry]) => {
                        if (entry && entry.dot) {
                            allEntries.push({ date, hour: parseInt(hour), entry });
                        }
                    });
                });
            } else {
                Object.entries(timeline).forEach(([hour, entry]) => {
                    if (entry && entry.dot) {
                        allEntries.push({ hour: parseInt(hour), entry });
                    }
                });
            }
        }

        const lyricsLines = this.currentLyrics ? this.currentLyrics.split('\n').filter(line => line.trim()) : [];
        const totalFrames = Math.max(allEntries.length * 60, 300); // 60 frames per entry, minimum 300 frames
        const fps = 30;
        const duration = totalFrames / fps;

        // Animation function
        const drawFrame = (frame) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Animated background
            const time = frame * 0.02;
            const gradient = ctx.createRadialGradient(
                canvas.width/2 + Math.sin(time) * 50, 
                canvas.height/2 + Math.cos(time) * 50, 
                0,
                canvas.width/2, 
                canvas.height/2, 
                Math.max(canvas.width, canvas.height) * 0.6
            );
            gradient.addColorStop(0, '#000428');
            gradient.addColorStop(0.6, '#004e92');
            gradient.addColorStop(1, '#1e3c72');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Floating particles
            for (let i = 0; i < 15; i++) {
                const particleTime = time + i * 0.8;
                const x = (Math.sin(particleTime) * 0.4 + 0.5) * canvas.width;
                const y = (Math.cos(particleTime * 0.6) * 0.4 + 0.5) * canvas.height;
                const size = 2 + Math.sin(particleTime * 3) * 1.5;
                
                ctx.fillStyle = `rgba(78, 205, 196, ${0.4 + Math.sin(particleTime * 2) * 0.3})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Title
            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 8;
            ctx.fillText('🎵 Consciousness Symphony 🎵', canvas.width / 2, 50);
            ctx.shadowBlur = 0;

            // Calculate current positions
            const progress = frame / totalFrames;
            const entryIndex = Math.floor(progress * allEntries.length);
            const lyricIndex = Math.floor(progress * lyricsLines.length);

            // Draw dots in a flowing pattern
            if (allEntries.length > 0) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = 120;

                allEntries.forEach((entry, index) => {
                    const angle = (index / allEntries.length) * Math.PI * 2 + time * 0.5;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    const isActive = index === entryIndex;
                    const scale = isActive ? 1.5 + Math.sin(frame * 0.2) * 0.3 : 1;
                    const dotRadius = (isActive ? 20 : 12) * scale;
                    
                    // Glow for active dot
                    if (isActive) {
                        ctx.shadowColor = entry.entry.dot.color;
                        ctx.shadowBlur = 20;
                    }
                    
                    ctx.fillStyle = entry.entry.dot.color;
                    ctx.beginPath();
                    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.shadowBlur = 0;
                    
                    // Connection lines
                    if (index > 0 && index <= entryIndex) {
                        const prevAngle = ((index - 1) / allEntries.length) * Math.PI * 2 + time * 0.5;
                        const prevX = centerX + Math.cos(prevAngle) * radius;
                        const prevY = centerY + Math.sin(prevAngle) * radius;
                        
                        ctx.strokeStyle = 'rgba(78, 205, 196, 0.6)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(prevX, prevY);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    }
                    
                    // Dot label
                    if (isActive) {
                        ctx.fillStyle = 'white';
                        ctx.font = 'bold 14px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(entry.entry.dot.name, x, y + dotRadius + 20);
                    }
                });
            }

            // Current lyric display
            if (lyricIndex < lyricsLines.length && lyricsLines[lyricIndex].trim()) {
                const lyricY = canvas.height - 80;
                
                // Lyric background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(50, lyricY - 30, canvas.width - 100, 60);
                
                // Lyric border
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(50, lyricY - 30, canvas.width - 100, 60);
                
                // Lyric text
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(lyricsLines[lyricIndex].trim(), canvas.width / 2, lyricY);
            }
        };

        // Animation loop
        const animate = () => {
            if (isAnimating && animationFrame < totalFrames) {
                drawFrame(animationFrame);
                animationFrame++;
                
                const progress = animationFrame / totalFrames;
                document.getElementById('video-progress-bar').style.width = (progress * 100) + '%';
                
                const currentTime = animationFrame / fps;
                const minutes = Math.floor(currentTime / 60);
                const seconds = Math.floor(currentTime % 60);
                const totalMinutes = Math.floor(duration / 60);
                const totalSeconds = Math.floor(duration % 60);
                document.getElementById('video-time').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
                
                animationId = requestAnimationFrame(animate);
            } else if (animationFrame >= totalFrames) {
                stopAnimation();
            }
        };

        const startAnimation = () => {
            if (animationFrame >= totalFrames) animationFrame = 0;
            isAnimating = true;
            document.getElementById('play-animation').style.display = 'none';
            document.getElementById('pause-animation').style.display = 'inline-block';
            animate();
        };

        const stopAnimation = () => {
            isAnimating = false;
            document.getElementById('play-animation').style.display = 'inline-block';
            document.getElementById('pause-animation').style.display = 'none';
            if (animationId) cancelAnimationFrame(animationId);
        };

        // Event listeners
        document.getElementById('play-animation').addEventListener('click', startAnimation);
        document.getElementById('pause-animation').addEventListener('click', stopAnimation);
        
        document.getElementById('video-progress').addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            animationFrame = Math.floor(percent * totalFrames);
            drawFrame(animationFrame);
            document.getElementById('video-progress-bar').style.width = (percent * 100) + '%';
        });

        document.getElementById('close-video').addEventListener('click', () => {
            stopAnimation();
            document.body.removeChild(modal);
        });

        // Video recording variables
        let mediaRecorder = null;
        let recordedChunks = [];
        let canvasStream = null;

        // Initialize with first frame
        drawFrame(0);

        // Enhanced event listeners with video export features
        document.getElementById('download-webm').addEventListener('click', async () => {
            if (!canvasStream) {
                canvasStream = canvas.captureStream(30); // 30 FPS
            }
            
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(canvasStream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `consciousness-symphony-${Date.now()}.webm`;
                a.click();
                URL.revokeObjectURL(url);
                alert('🎬 Video downloaded successfully! You can convert WebM to MP4 using online converters.');
            };

            // Start recording and animation
            mediaRecorder.start();
            animationFrame = 0;
            isAnimating = true;
            document.getElementById('download-webm').disabled = true;
            document.getElementById('download-webm').textContent = '🔴 Recording...';
            
            const recordAndAnimate = () => {
                if (isAnimating && animationFrame < totalFrames) {
                    drawFrame(animationFrame);
                    animationFrame++;
                    animationId = requestAnimationFrame(recordAndAnimate);
                } else {
                    mediaRecorder.stop();
                    document.getElementById('download-webm').disabled = false;
                    document.getElementById('download-webm').textContent = '📥 Download Video (WebM)';
                }
            };
            
            recordAndAnimate();
        });

        document.getElementById('download-gif').addEventListener('click', async () => {
            const frames = [];
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = 480;
            tempCanvas.height = 270;
            
            // Generate frames for GIF (lower resolution for file size)
            for (let i = 0; i < Math.min(totalFrames, 150); i += 2) { // Every other frame, max 75 frames
                // Draw frame on main canvas
                drawFrame(i);
                
                // Scale down to temp canvas
                tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
                
                // Convert to data URL
                frames.push(tempCanvas.toDataURL('image/png'));
            }
            
            // Create animated GIF data
            const gifData = this.createAnimatedGIF(frames);
            const blob = new Blob([gifData], { type: 'image/gif' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `consciousness-symphony-${Date.now()}.gif`;
            a.click();
            URL.revokeObjectURL(url);
            alert('🎞️ Animated GIF created! Note: For best quality, use the WebM download option.');
        });

        document.getElementById('record-screen').addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: { mediaSource: 'screen' }
                });
                
                const recorder = new MediaRecorder(stream);
                const chunks = [];
                
                recorder.ondataavailable = (event) => chunks.push(event.data);
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/mp4' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `consciousness-symphony-screen-${Date.now()}.mp4`;
                    a.click();
                    URL.revokeObjectURL(url);
                };
                
                recorder.start();
                alert('🔴 Screen recording started! Play the animation and stop recording when done. The video will download automatically.');
                
                // Stop recording when stream ends
                stream.getVideoTracks()[0].onended = () => {
                    recorder.stop();
                };
                
            } catch (err) {
                alert('Screen recording not supported or permission denied. Use the WebM download option instead.');
            }
        });

        document.getElementById('share-video').addEventListener('click', () => {
            // Create mobile-responsive share modal
            const shareModal = document.createElement('div');
            shareModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 4000;
                padding: 20px;
            `;

            const shareContent = document.createElement('div');
            shareContent.style.cssText = `
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                border: 2px solid var(--primary-color);
                border-radius: 20px;
                padding: 20px;
                max-width: 500px;
                width: 100%;
                color: white;
                text-align: center;
            `;

            const shareData = {
                timeline: this.musicTimeline,
                lyrics: this.currentLyrics,
                mapping: this.musicMapping ? Object.fromEntries(this.musicMapping) : {},
                speed: this.playbackSpeed,
                instruments: this.backgroundInstruments
            };
            
            const encoded = btoa(JSON.stringify(shareData));
            const shareURL = `${window.location.origin}${window.location.pathname}?video=${encoded}`;
            const shareText = encodeURIComponent("Check out my Consciousness Symphony created with Dot Symphony! 🎵✨");
            const shareTitle = encodeURIComponent("My Consciousness Symphony");

            shareContent.innerHTML = `
                <h3 style="color: var(--primary-color); margin-bottom: 20px;">🌐 Share Your Symphony</h3>
                <p style="margin-bottom: 20px;">Share your consciousness symphony on social media:</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px;">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}" target="_blank" class="social-share-btn" style="background: #1877F2; color: white; padding: 10px; border-radius: 8px; text-decoration: none; display: block;">📘 Facebook</a>
                    <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareURL)}" target="_blank" class="social-share-btn" style="background: #1DA1F2; color: white; padding: 10px; border-radius: 8px; text-decoration: none; display: block;">🐦 Twitter/X</a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}" target="_blank" class="social-share-btn" style="background: #0A66C2; color: white; padding: 10px; border-radius: 8px; text-decoration: none; display: block;">💼 LinkedIn</a>
                    <a href="whatsapp://send?text=${shareText}%20${encodeURIComponent(shareURL)}" class="social-share-btn" style="background: #25D366; color: white; padding: 10px; border-radius: 8px; text-decoration: none; display: block;">💬 WhatsApp</a>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: var(--primary-color);">Shareable Link:</label>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="text" id="share-url-input" value="${shareURL}" readonly style="
                            flex: 1; 
                            padding: 10px; 
                            border: 1px solid var(--glass-border); 
                            border-radius: 8px; 
                            background: rgba(0,0,0,0.3); 
                            color: white; 
                            font-size: 0.8rem;
                            max-width: 300px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        ">
                        <button id="copy-share-url" class="btn btn-primary" style="font-size: 0.8rem; padding: 8px 12px; white-space: nowrap;">📋 Copy</button>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button id="close-share-modal" class="btn btn-danger" style="font-size: 0.9rem;">✕ Close</button>
                </div>
            `;

            shareModal.appendChild(shareContent);
            document.body.appendChild(shareModal);

            // Event listeners for share modal
            document.getElementById('copy-share-url').addEventListener('click', () => {
                const shareInput = document.getElementById('share-url-input');
                shareInput.select();
                shareInput.setSelectionRange(0, 99999); // For mobile devices
                
                navigator.clipboard.writeText(shareURL).then(() => {
                    const copyBtn = document.getElementById('copy-share-url');
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✅ Copied!';
                    copyBtn.style.background = 'var(--success-color)';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = '';
                    }, 2000);
                }).catch(() => {
                    // Fallback for browsers that don't support clipboard API
                    shareInput.select();
                    try {
                        document.execCommand('copy');
                        alert('🔗 Share link copied to clipboard!');
                    } catch (err) {
                        prompt('Copy this link to share your video:', shareURL);
                    }
                });
            });

            document.getElementById('close-share-modal').addEventListener('click', () => {
                document.body.removeChild(shareModal);
            });

            shareModal.addEventListener('click', (e) => {
                if (e.target === shareModal) {
                    document.body.removeChild(shareModal);
                }
            });
        });

        // Show enhanced instructions
        setTimeout(() => {
            alert('🎬 Enhanced Video Export Ready!\n\n▶️ Play to preview your animation\n📥 Download as WebM video file\n🎞️ Create animated GIF\n📹 Record full-quality screen capture\n🔗 Share with others via link');
        }, 500);
    }

    createVideoHTML(frames, entries, lyrics) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consciousness Symphony Video</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            color: white;
            font-family: 'Arial', sans-serif;
            overflow: hidden;
        }
        .video-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .frame {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 30px;
            border-radius: 25px;
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .btn {
            background: #4ecdc4;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        .btn:hover {
            background: #44a08d;
        }
        .progress {
            flex: 1;
            min-width: 200px;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            cursor: pointer;
        }
        .progress-bar {
            height: 100%;
            background: #4ecdc4;
            border-radius: 3px;
            transition: width 0.1s;
        }
        .info {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            max-width: 300px;
        }
    </style>
</head>
<body>
    <div class="video-container">
        <canvas id="video-canvas" class="frame"></canvas>
    </div>
    
    <div class="info">
        <h3>🎵 Consciousness Symphony</h3>
        <p id="current-info">Ready to play...</p>
    </div>
    
    <div class="controls">
        <button class="btn" id="play-btn">▶️ Play</button>
        <button class="btn" id="pause-btn" style="display: none;">⏸️ Pause</button>
        <div class="progress" id="progress">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        <span id="time-display">0:00 / 0:00</span>
    </div>

    <script>
        const canvas = document.getElementById('video-canvas');
        const ctx = canvas.getContext('2d');
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const progressBar = document.getElementById('progress-bar');
        const progress = document.getElementById('progress');
        const timeDisplay = document.getElementById('time-display');
        const currentInfo = document.getElementById('current-info');
        
        const entries = ${JSON.stringify(entries)};
        const lyrics = ${JSON.stringify(lyrics)};
        
        let isPlaying = false;
        let currentFrame = 0;
        const fps = 30;
        const totalFrames = Math.max(entries.length * 30, lyrics.length * 30, 150);
        const duration = totalFrames / fps;
        let animationId;
        
        canvas.width = 1920;
        canvas.height = 1080;
        
        function drawFrame(frameIndex) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background
            const time = frameIndex * 0.05;
            const gradient = ctx.createRadialGradient(
                canvas.width/2 + Math.sin(time) * 100, 
                canvas.height/2 + Math.cos(time) * 100, 
                0,
                canvas.width/2, 
                canvas.height/2, 
                Math.max(canvas.width, canvas.height)
            );
            gradient.addColorStop(0, '#000428');
            gradient.addColorStop(0.5, '#004e92');
            gradient.addColorStop(1, '#1e3c72');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Particles
            for (let i = 0; i < 20; i++) {
                const particleTime = time + i * 0.5;
                const x = (Math.sin(particleTime) * 0.3 + 0.5) * canvas.width;
                const y = (Math.cos(particleTime * 0.7) * 0.3 + 0.5) * canvas.height;
                const size = 3 + Math.sin(particleTime * 2) * 2;
                
                ctx.fillStyle = \`rgba(78, 205, 196, \${0.3 + Math.sin(particleTime) * 0.3})\`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Title
            ctx.fillStyle = 'white';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.fillText('🎵 Consciousness Symphony 🎵', canvas.width / 2, 120);
            ctx.shadowBlur = 0;
            
            // Current lyric
            const lyricIndex = Math.floor((frameIndex / totalFrames) * lyrics.length);
            if (lyricIndex < lyrics.length && lyrics[lyricIndex]) {
                const lyricY = canvas.height - 300;
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(canvas.width * 0.05, lyricY - 50, canvas.width * 0.9, 100);
                
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.strokeRect(canvas.width * 0.05, lyricY - 50, canvas.width * 0.9, 100);
                
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 42px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(lyrics[lyricIndex].trim(), canvas.width / 2, lyricY);
                
                // Update info
                const entryIndex = Math.floor((frameIndex / totalFrames) * entries.length);
                if (entryIndex < entries.length) {
                    const entry = entries[entryIndex];
                    currentInfo.innerHTML = \`
                        <strong>Now Playing:</strong><br>
                        \${entry.entry.dot.name}<br>
                        <small>\${entry.hour || entry.date}:00</small><br>
                        <small>Line \${lyricIndex + 1}: "\${lyrics[lyricIndex].trim()}"</small>
                    \`;
                }
            }
        }
        
        function animate() {
            if (isPlaying && currentFrame < totalFrames) {
                drawFrame(currentFrame);
                currentFrame++;
                
                const progress = currentFrame / totalFrames;
                progressBar.style.width = (progress * 100) + '%';
                
                const currentTime = Math.floor((currentFrame / fps) * 100) / 100;
                timeDisplay.textContent = \`\${Math.floor(currentTime / 60)}:\${(currentTime % 60).toFixed(0).padStart(2, '0')} / \${Math.floor(duration / 60)}:\${Math.floor(duration % 60).toString().padStart(2, '0')}\`;
                
                animationId = requestAnimationFrame(animate);
            } else if (currentFrame >= totalFrames) {
                stop();
            }
        }
        
        function play() {
            if (currentFrame >= totalFrames) currentFrame = 0;
            isPlaying = true;
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
            animate();
        }
        
        function pause() {
            isPlaying = false;
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            if (animationId) cancelAnimationFrame(animationId);
        }
        
        function stop() {
            isPlaying = false;
            currentFrame = 0;
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            if (animationId) cancelAnimationFrame(animationId);
            drawFrame(0);
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00 / ' + Math.floor(duration / 60) + ':' + Math.floor(duration % 60).toString().padStart(2, '0');
            currentInfo.innerHTML = '<strong>Ready to play...</strong>';
        }
        
        playBtn.addEventListener('click', play);
        pauseBtn.addEventListener('click', pause);
        
        progress.addEventListener('click', (e) => {
            const rect = progress.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            currentFrame = Math.floor(percent * totalFrames);
            drawFrame(currentFrame);
            progressBar.style.width = (percent * 100) + '%';
        });
        
        // Initialize
        drawFrame(0);
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (isPlaying) pause(); else play();
            }
        });
    </script>
</body>
</html>`;
    }

    generateSheetMusic() {
        const timeline = this.musicTimeline.timeline;
        let notes = [];

        // Extract notes with enhanced musical information
        if (typeof timeline === 'object') {
            const firstKey = Object.keys(timeline)[0];
            if (firstKey && timeline[firstKey] && typeof timeline[firstKey] === 'object' && !timeline[firstKey].dot) {
                // Date range structure
                Object.entries(timeline).forEach(([date, dayData]) => {
                    Object.entries(dayData).forEach(([hour, entry]) => {
                        if (entry && entry.dot) {
                            const mapping = this.musicMapping.get(entry.dot.id) || {};
                            const scale = this.scales[mapping.scale] || this.scales.major;
                            const noteIndex = Math.abs(entry.dot.name.charCodeAt(0)) % scale.length;
                            const frequency = scale[noteIndex];
                            
                            notes.push({
                                time: `${date} ${hour}:00`,
                                name: entry.dot.name,
                                instrument: mapping.instrument || 'piano',
                                color: entry.dot.color,
                                frequency: frequency,
                                scale: mapping.scale || 'major',
                                duration: mapping.noteLength || 'half',
                                volume: mapping.volume || 70,
                                noteSymbol: this.getMusicalNoteSymbol(frequency),
                                journal: entry.journal || ''
                            });
                        }
                    });
                });
            }
        }

        // Prepare lyrics lines for sheet music
        const lyricsLines = this.currentLyrics ? this.currentLyrics.split('\n').filter(line => line.trim()) : [];

        return `
<div style="max-width: 800px; margin: 0 auto;">
    <h1 style="text-align: center; color: #2c3e50; margin-bottom: 10px;">🎼 Consciousness Symphony</h1>
    <h2 style="text-align: center; color: #7f8c8d; margin-bottom: 30px;">Generated from Dot Timeline Data</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 Symphony Statistics</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div><strong>Total Notes:</strong> ${notes.length}</div>
            <div><strong>Instruments Used:</strong> ${[...new Set(notes.map(n => n.instrument))].length}</div>
            <div><strong>Emotional Range:</strong> ${[...new Set(notes.map(n => n.name))].length} states</div>
            <div><strong>Time Span:</strong> ${notes.length > 0 ? `${notes[0].time} → ${notes[notes.length - 1].time}` : 'N/A'}</div>
        </div>
    </div>

    <div style="background: white; border: 2px solid #3498db; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 20px;">🎵 Musical Notation</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #3498db; color: white;">
                    <th style="padding: 12px; border: 1px solid #ddd;">Measure</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Time</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Emotion</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Note</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Instrument</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Scale</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">Duration</th>
                </tr>
            </thead>
            <tbody>
                ${notes.map((note, index) => `
                    <tr style="border-bottom: 1px solid #ddd; ${index % 2 === 0 ? 'background: #f8f9fa;' : ''}">
                        <td style="padding: 10px; text-align: center; font-weight: bold;">${index + 1}</td>
                        <td style="padding: 10px; font-size: 0.9em;">${note.time}</td>
                        <td style="padding: 10px;">
                            <span style="color: ${note.color}; font-size: 1.2em;">●</span>
                            <strong>${note.name}</strong>
                        </td>
                        <td style="padding: 10px; text-align: center; font-size: 1.5em;">${note.noteSymbol}</td>
                        <td style="padding: 10px; text-transform: capitalize;">${note.instrument}</td>
                        <td style="padding: 10px; text-transform: capitalize;">${note.scale}</td>
                        <td style="padding: 10px;">${note.duration} note</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    ${lyricsLines.length > 0 ? `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #856404; margin-bottom: 15px;">🎭 Synchronized Lyrics</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                ${lyricsLines.map((line, index) => `
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                        <strong>Line ${index + 1}:</strong><br>
                        <em style="font-size: 1.1em;">"${line.trim()}"</em>
                        ${notes[index] ? `<br><small style="color: #6c757d;">♪ ${notes[index].name} (${notes[index].instrument})</small>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : ''}

    <div style="background: #e8f5e8; border: 2px solid #28a745; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
        <h3 style="color: #155724; margin-bottom: 15px;">🎹 Instrument Breakdown</h3>
        ${[...new Set(notes.map(n => n.instrument))].map(instrument => {
            const instrumentNotes = notes.filter(n => n.instrument === instrument);
            return `
                <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px;">
                    <h4 style="color: #2c3e50; margin-bottom: 10px; text-transform: capitalize;">🎼 ${instrument} (${instrumentNotes.length} notes)</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${instrumentNotes.map(note => `
                            <span style="background: ${note.color}; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">
                                ${note.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('')}
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📝 Performance Notes</h3>
        <ul style="line-height: 1.8;">
            <li><strong>Tempo:</strong> Moderato (♩ = 60 BPM) - Reflective consciousness pace</li>
            <li><strong>Key Signature:</strong> Varies by emotional scale (Major/Minor/Pentatonic/Blues)</li>
            <li><strong>Dynamics:</strong> Each note's volume reflects emotional intensity (${Math.min(...notes.map(n => n.volume))}% - ${Math.max(...notes.map(n => n.volume))}%)</li>
            <li><strong>Expression:</strong> Play with emotional authenticity, each note represents a moment of consciousness</li>
            <li><strong>Structure:</strong> Linear emotional journey through time, allow for natural phrasing</li>
        </ul>
    </div>

    <div style="border-top: 2px solid #dee2e6; padding-top: 20px; text-align: center; color: #6c757d;">
        <p><strong>Generated by Dot Symphony</strong> - A Consciousness Expression App</p>
        <p><em>This sheet music represents your unique emotional journey translated into musical notation.</em></p>
        <p style="font-size: 0.9em;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
</div>`;
    }

    getMusicalNoteSymbol(frequency) {
        // Map frequencies to musical note symbols
        const noteMap = {
            261.63: '♪ C',
            293.66: '♪ D',
            329.63: '♪ E',
            349.23: '♪ F',
            392.00: '♪ G',
            440.00: '♪ A',
            493.88: '♪ B',
            523.25: '♪ C\'',
            311.13: '♪ E♭',
            415.30: '♪ A♭',
            466.16: '♪ B♭',
            369.99: '♪ F#'
        };

        // Find closest match
        let closestNote = '♪ ?';
        let smallestDiff = Infinity;
        
        Object.entries(noteMap).forEach(([freq, symbol]) => {
            const diff = Math.abs(parseFloat(freq) - frequency);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                closestNote = symbol;
            }
        });

        return closestNote;
    }

    generateShareURL() {
        if (!this.musicTimeline) {
            alert('Please import a timeline first');
            return;
        }

        const shareData = {
            timeline: this.musicTimeline,
            dictionary: this.dictionary,
            version: '1.0'
        };

        const encoded = btoa(JSON.stringify(shareData));
        const shareURL = `${window.location.origin}${window.location.pathname}?share=${encoded}`;

        navigator.clipboard.writeText(shareURL).then(() => {
            alert('Share URL copied to clipboard!');
        }).catch(() => {
            prompt('Copy this URL to share:', shareURL);
        });
    }

    // LLM INTEGRATION METHODS
    async analyzeLLM(text) {
    if (!this.llmSettings.apiKey || this.llmSettings.apiKey.trim() === '') {
        throw new Error('No API key configured');
    }

    const prompt = `Analyze this journal entry and identify ALL emotions, feelings, and mental states mentioned or implied. Be comprehensive and include subtle emotions. Return ONLY a valid JSON object with an "emotions" array containing all detected emotions/feelings as strings. Include basic emotions (happy, sad, angry, fear, surprise, disgust) as well as complex emotions (anxious, excited, nostalgic, frustrated, motivated, creative, peaceful, energetic, melancholic, hopeful, confused, focused, tired, stressed, content, grateful, lonely, confident, overwhelmed, inspired, etc.). 

Text to analyze: "${text}"

Expected format: {"emotions": ["emotion1", "emotion2", "emotion3"]}`;

    switch (this.llmSettings.provider) {
        case 'openai':
            return await this.analyzeOpenAI(prompt);
        case 'anthropic':
            return await this.analyzeAnthropic(prompt);
        case 'gemini':
            return await this.analyzeGemini(prompt);
        case 'deepseek':
            return await this.analyzeDeepSeek(prompt);
        case 'llama':
            return await this.analyzeLLaMA(prompt);
        case 'mistral':
            return await this.analyzeMistral(prompt);
        case 'perplexity':
            return await this.analyzePerplexity(prompt);
        case 'cohere':
            return await this.analyzeCohere(prompt);
        case 'groq':
            return await this.analyzeGroq(prompt);
        default:
            throw new Error(`Unsupported LLM provider: ${this.llmSettings.provider}`);
    }
    }

    async generateLyricsWithLLM(prompt) {
        const { provider, apiKey, model } = this.llmSettings;

        const headers = {
            'Content-Type': 'application/json'
        };

        let url = '';
        let body = {};

        try {
            switch (provider) {
                case 'openai':
                    url = 'https://api.openai.com/v1/chat/completions';
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300,
                        temperature: 0.7
                    };
                    break;

                case 'anthropic':
                    url = 'https://api.anthropic.com/v1/messages';
                    headers['x-api-key'] = apiKey;
                    headers['anthropic-version'] = '2023-06-01';
                    body = {
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300
                    };
                    break;

                case 'gemini':
                    url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                    body = {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 300
                        }
                    };
                    break;

                case 'deepseek':
                    url = 'https://api.deepseek.com/v1/chat/completions';
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300,
                        temperature: 0.7
                    };
                    break;

                case 'llama':
                    url = 'https://api-inference.huggingface.co/models/' + model;
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 300,
                            temperature: 0.7
                        }
                    };
                    break;

                case 'mistral':
                    url = 'https://api.mistral.ai/v1/chat/completions';
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300,
                        temperature: 0.7
                    };
                    break;

                case 'perplexity':
                    url = 'https://api.perplexity.ai/chat/completions';
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300,
                        temperature: 0.7
                    };
                    break;

                case 'cohere':
                    url = 'https://api.cohere.ai/v1/chat';
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model,
                        message: prompt,
                        temperature: 0.7,
                        max_tokens: 300
                    };
                    break;

                case 'groq':
                    url = 'https://api.groq.com/openai/v1/chat/completions';
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300,
                        temperature: 0.7
                    };
                    break;

                default:
                    throw new Error(`Unsupported provider: ${provider}`);
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`${provider} API error: ${response.status}`);
            }

            const data = await response.json();

            // Extract content based on provider response format
            switch (provider) {
                case 'gemini':
                    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                case 'anthropic':
                    return data.content?.[0]?.text || '';
                case 'llama':
                    return data?.[0]?.generated_text || '';
                case 'cohere':
                    return data.text || '';
                default:
                    return data.choices?.[0]?.message?.content || '';
            }
        } catch (error) {
            console.warn('LLM lyrics generation failed:', error);
            throw error;
        }
    }

    async analyzeOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (e) {
            // Fallback: extract emotions from text response
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeAnthropic(prompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.llmSettings.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.llmSettings.model,
                max_tokens: 150,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.content[0].text;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeGemini(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.llmSettings.model}:generateContent?key=${this.llmSettings.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 150
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeDeepSeek(prompt) {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeLLaMA(prompt) {
        const response = await fetch('https://api.together.xyz/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model,  // e.g., 'meta-llama/Llama-3-8B-Instruct'
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`LLaMA API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeMistral(prompt) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model,  // e.g., 'mistralai/mistral-7b-instruct'
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzePerplexity(prompt) {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model,  // e.g., 'mistral-7b-instruct'
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeCohere(prompt) {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model, // e.g., 'command-r'
                message: prompt,
                temperature: 0.3,
                max_tokens: 150,
                chat_history: []  // Optional: supply history if needed
            })
        });

        if (!response.ok) {
            throw new Error(`Cohere API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.text;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    async analyzeGroq(prompt) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.llmSettings.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmSettings.model, // e.g., 'mixtral-8x7b-32768'
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 150,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (e) {
            const emotions = content.toLowerCase().match(/\b(joy|happy|excited|calm|peaceful|sad|anxious|worried|angry|focused|confused|love|grateful)\b/g) || [];
            return { emotions: [...new Set(emotions)] };
        }
    }

    updateLLMProvider(provider) {
        this.llmSettings.provider = provider;
        this.updateLLMModelOptions();
        this.updateAPIKeyHelp();
        this.saveToStorage();
    }

    updateLLMApiKey(apiKey) {
        this.llmSettings.apiKey = apiKey;
        this.saveToStorage();
    }

    updateLLMModel(model) {
        this.llmSettings.model = model;
        this.saveToStorage();
    }

    updateLLMModelOptions() {
        const modelSelect = document.getElementById('llm-model');
        const provider = this.llmSettings.provider;

        modelSelect.innerHTML = '';

        const models = {
            openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
            anthropic: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
            gemini: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'],
            deepseek: ['deepseek-chat', 'deepseek-coder'],
            llama: ['meta-llama/Llama-3-8B-Instruct', 'meta-llama/Llama-3-70B-Instruct'],
            mistral: ['mistralai/mistral-7b-instruct', 'mistralai/mixtral-8x7b-instruct'],
            perplexity: ['mistral-7b-instruct', 'mixtral-8x7b', 'llama-3-70b-instruct'],
            cohere: ['command-r', 'command-r+'],
            groq: ['mixtral-8x7b-32768', 'llama3-8b-8192', 'llama3-70b-8192']
        };

        (models[provider] || ['gpt-3.5-turbo']).forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === this.llmSettings.model) {
                option.selected = true;
            }
            modelSelect.appendChild(option);
        });
    }

    updateLLMSettingsUI() {
        document.getElementById('llm-provider').value = this.llmSettings.provider;
        document.getElementById('llm-api-key').value = this.llmSettings.apiKey;
        this.updateLLMModelOptions();
    }

    showLLMStatus(message, type = 'info') {
        // Remove any existing status
        const existingStatus = document.getElementById('llm-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        // Create new status element
        const status = document.createElement('div');
        status.id = 'llm-status';
        status.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: slideIn 0.3s ease;
        `;

        // Set background based on type
        const backgrounds = {
            info: 'rgba(33, 150, 243, 0.9)',
            success: 'rgba(76, 175, 80, 0.9)',
            warning: 'rgba(255, 152, 0, 0.9)',
            error: 'rgba(244, 67, 54, 0.9)'
        };

        status.style.background = backgrounds[type] || backgrounds.info;
        status.textContent = message;

        document.body.appendChild(status);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (status && status.parentNode) {
                status.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (status.parentNode) {
                        status.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    async generateLLMContent(prompt) {
        const { provider, apiKey, model } = this.llmSettings;

        const headers = {
            'Content-Type': 'application/json'
        };
        let url = '';
        let body = {};

        switch (provider) {
            case 'openai':
                url = 'https://api.openai.com/v1/chat/completions';
                headers['Authorization'] = `Bearer ${apiKey}`;
                body = {
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 500,
                    temperature: 0.7
                };
                break;

            case 'anthropic':
                url = 'https://api.anthropic.com/v1/messages';
                headers['x-api-key'] = apiKey;
                headers['anthropic-version'] = '2023-06-01';
                body = {
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 500
                };
                break;

            case 'gemini':
                url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                body = {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                };
                break;

            case 'deepseek':
                url = 'https://api.deepseek.com/v1/chat/completions';
                headers['Authorization'] = `Bearer ${apiKey}`;
                body = {
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 500,
                    temperature: 0.7
                };
                break;

            case 'llama':
            case 'mistral':
            case 'perplexity':
            case 'groq':
                url = provider === 'groq'
                    ? 'https://api.groq.com/openai/v1/chat/completions'
                    : provider === 'perplexity'
                    ? 'https://api.perplexity.ai/chat/completions'
                    : 'https://api.example.com/v1/chat/completions'; // Replace with actual endpoint if needed
                headers['Authorization'] = `Bearer ${apiKey}`;
                body = {
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 500,
                    temperature: 0.7
                };
                break;

            case 'cohere':
                url = 'https://api.cohere.ai/v1/chat';
                headers['Authorization'] = `Bearer ${apiKey}`;
                body = {
                    model,
                    message: prompt,
                    temperature: 0.7,
                    max_tokens: 500
                };
                break;

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`${provider} API error: ${response.status}`);
            }

            const data = await response.json();
            let content = '';

            if (provider === 'cohere') {
                content = data.text;
            } else if (provider === 'gemini') {
                content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } else if (provider === 'anthropic') {
                content = data.content?.[0]?.text || '';
            } else {
                content = data.choices?.[0]?.message?.content || '';
            }

            try {
                return JSON.parse(content);
            } catch (e) {
                return { content };
            }

        } catch (error) {
            console.warn('LLM content generation failed:', error);
            throw error;
        }
    }

    
    createAnimatedGIF(frames) {
        // Simple GIF creation (basic implementation)
        // In a real implementation, you'd use a library like gif.js
        // For now, return a basic data structure that represents the concept
        const gifHeader = new Uint8Array([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a
        ]);
        
        // This is a simplified version - in production you'd use a proper GIF encoding library
        alert('📋 GIF frames captured! In a production environment, this would create a proper animated GIF. For now, the first frame will be downloaded as PNG.');
        
        // Convert first frame to blob as fallback
        const firstFrame = frames[0];
        const byteString = atob(firstFrame.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        
        return uint8Array;
    }

    // SETTINGS & UTILITY METHODS
    toggleDropdownMenu() {
        const menu = document.getElementById('dropdown-menu');
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
        
        // Close menu when clicking outside
        if (!isVisible) {
            setTimeout(() => {
                document.addEventListener('click', (e) => {
                    if (!menu.contains(e.target) && !document.getElementById('menu-toggle').contains(e.target)) {
                        menu.style.display = 'none';
                    }
                }, { once: true });
            }, 100);
        }
    }

    openSettingsModal() {
        document.getElementById('dropdown-menu').style.display = 'none';
        document.getElementById('settings-modal').style.display = 'flex';
        this.updateAPIKeyHelp();
    }

    closeSettingsModal() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    async openDocumentationModal() {
        document.getElementById('dropdown-menu').style.display = 'none';
        document.getElementById('documentation-modal').style.display = 'flex';
        
        try {
            const response = await fetch('./README.md');
            const markdown = await response.text();
            document.getElementById('documentation-content').innerHTML = this.convertMarkdownToHTML(markdown);
        } catch (error) {
            document.getElementById('documentation-content').innerHTML = '<p style="color: var(--danger-color);">Error loading documentation. Please check if README.md exists.</p>';
        }
    }

    closeDocumentationModal() {
        document.getElementById('documentation-modal').style.display = 'none';
    }

    async openTermsModal() {
        document.getElementById('dropdown-menu').style.display = 'none';
        document.getElementById('terms-modal').style.display = 'flex';
        
        try {
            const response = await fetch('./termsOfUse.md');
            const markdown = await response.text();
            document.getElementById('terms-content').innerHTML = this.convertMarkdownToHTML(markdown);
        } catch (error) {
            document.getElementById('terms-content').innerHTML = '<p style="color: var(--danger-color);">Error loading terms of use. Please check if termsOfUse.md exists.</p>';
        }
    }

    closeTermsModal() {
        document.getElementById('terms-modal').style.display = 'none';
    }

    async openPrivacyModal() {
        document.getElementById('dropdown-menu').style.display = 'none';
        document.getElementById('privacy-modal').style.display = 'flex';
        
        try {
            const response = await fetch('./privacyPolicy.md');
            const markdown = await response.text();
            document.getElementById('privacy-content').innerHTML = this.convertMarkdownToHTML(markdown);
        } catch (error) {
            document.getElementById('privacy-content').innerHTML = '<p style="color: var(--danger-color);">Error loading privacy policy. Please check if privacyPolicy.md exists.</p>';
        }
    }

    closePrivacyModal() {
        document.getElementById('privacy-modal').style.display = 'none';
    }

    convertMarkdownToHTML(markdown) {
        // Simple markdown to HTML converter
        return markdown
            .replace(/^# (.*$)/gim, '<h1 style="color: var(--primary-color); margin: 20px 0 15px 0;">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 style="color: var(--primary-color); margin: 15px 0 10px 0;">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 style="color: var(--accent-color); margin: 15px 0 10px 0;">$1</h3>')
            .replace(/^\* (.*$)/gim, '<li style="margin: 5px 0;">$1</li>')
            .replace(/^- (.*$)/gim, '<li style="margin: 5px 0;">$1</li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 3px;">$1</code>')
            .replace(/^\s*$/gm, '<br>')
            .replace(/\n/g, '<br>');
    }

    updateAPIKeyHelp() {
        const provider = document.getElementById('llm-provider').value;
        const helpLink = document.getElementById('api-key-help');

        const apiKeyLinks = {
            openai: 'https://platform.openai.com/api-keys',
            anthropic: 'https://console.anthropic.com/account/keys',
            gemini: 'https://makersuite.google.com/app/apikey',
            deepseek: 'https://platform.deepseek.com/api-keys',
            llama: 'https://huggingface.co/meta-llama', // Usually hosted via Hugging Face
            mistral: 'https://console.mistral.ai/api-keys',
            perplexity: 'https://www.perplexity.ai/settings/api',
            cohere: 'https://dashboard.cohere.com/api-keys',
            groq: 'https://console.groq.com/keys'
        };

        helpLink.href = apiKeyLinks[provider] || '#';
        helpLink.textContent = `Get ${provider.charAt(0).toUpperCase() + provider.slice(1)} API Key →`;
    }

    changeTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        localStorage.setItem('dot-symphony-theme', theme);
    }

    resetAllData() {
        if (confirm('This will delete all your data. Are you sure?')) {
            localStorage.removeItem('dot-symphony-dictionary');
            localStorage.removeItem('dot-symphony-timeline');
            localStorage.removeItem('dot-symphony-theme');
            location.reload();
        }
    }

    exportAllData() {
        const allData = {
            dictionary: this.dictionary,
            timeline: this.timelineData,
            exported: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dot-symphony-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
let dotSymphony;
document.addEventListener('DOMContentLoaded', () => {
    dotSymphony = new DotSymphony();

    // Handle shared URLs
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData) {
        try {
            const decoded = JSON.parse(atob(shareData));
            if (decoded.timeline && decoded.dictionary) {
                dotSymphony.musicTimeline = decoded.timeline;
                dotSymphony.dictionary = decoded.dictionary;
                dotSymphony.switchModule('music');
                dotSymphony.renderImportedTimeline();
                dotSymphony.generateMusicMapping();
                dotSymphony.generateLyrics();
                alert('Shared symphony loaded successfully!');
            }
        } catch (e) {
            console.warn('Error loading shared data:', e);
        }
    }
});

// Handle audio context activation on user interaction
document.addEventListener('click', function initAudio() {
    if (dotSymphony && dotSymphony.audioContext && dotSymphony.audioContext.state === 'suspended') {
        dotSymphony.audioContext.resume();
    }
    document.removeEventListener('click', initAudio);
}, { once: true });
