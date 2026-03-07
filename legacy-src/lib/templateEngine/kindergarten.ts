import type { KindergartenLessonData, GeneratedLessonPlan } from '../../app/types/lesson-types';


function getWindow(dateStr: string): 'BOY' | 'MOY' | 'EOY' {
  const d = new Date(dateStr + 'T00:00:00');
  const m = d.getMonth() + 1; // 1-12
  if (m <= 10) return 'BOY'; // Aug-Oct typical
  if (m <= 1 || m === 11 || m === 12) return 'MOY'; // Nov-Jan
  return 'EOY'; // Feb-May
}

function splitLines(s?: string): string[] | undefined {
  const t = (s || '').trim();
  if (!t) return undefined;
  return t.split(/\n|\r|\.|;/).map(x => x.trim()).filter(Boolean);
}

function buildIESuggestions(input: KindergartenLessonData) {
  const window = getWindow(input.date || new Date().toISOString().slice(0,10));
  const phonics = input.phonicsConcept?.trim();
  const defaultNotes = [
    'Keep Tier 3 groups short (6–8 minutes) with high reps and immediate feedback.',
    'Tier 2 should practice the same skill with supports (sound boxes, arm tapping, picture cues).',
    'Enrichment should apply the skill in reading/writing (sentence building, word ladders, decodable extension).'
  ];

  const ie = input.ieGroups;
  const make = (tier: 'tier3'|'tier2'|'enrichment') => {
    const groups = ie?.[tier] || [];
    if (!groups.length) return undefined;
    return groups
      .filter(g => g.name?.trim())
      .map(g => ({
        groupName: g.name,
        canDoNow: splitLines(g.canDoNow),
        nextSteps: splitLines(g.nextSteps) || (phonics ? [`Apply ${phonics} in reading/writing with less support.`] : undefined),
        suggestedActivities: [
          phonics ? `Quick reps: 6–10 words with ${phonics} (read → build → write).` : 'Quick reps: sound drills → read → write.',
          tier === 'enrichment' ? 'Write a sentence using 2–3 target words; add an illustration.' : 'Use sound boxes/Elkonin to map sounds.',
        ],
      }));
  };

  return {
    window,
    tier3: make('tier3'),
    tier2: make('tier2'),
    enrichment: make('enrichment'),
    notes: defaultNotes,
  };
}


/**
 * Deterministic (non-AI) template engine.
 * Purpose: ensure we ALWAYS have a valid lesson plan skeleton even if AI fails.
 */
export function buildKindergartenLessonPlanTemplate(input: KindergartenLessonData): GeneratedLessonPlan {
  const title = `UFLI ${input.ufliLessonNumber} — Day ${input.dayNumber} • Savvas U${input.savvasUnit} W${input.savvasWeek} D${input.savvasDay}`;

  const objectives: string[] = [
    input.phonicsConcept
      ? `I can read and write words with ${input.phonicsConcept}.`
      : 'I can practice today’s phonics skill.',
    input.storyTitle
      ? `I can listen to and talk about “${input.storyTitle}.”`
      : 'I can listen to a story and answer questions about it.',
  ];

  const materials: string[] = [
    'Teacher slide deck',
    'Whiteboard / markers',
    'Student writing tools',
  ];

  if (input.sightWords?.some(sw => sw.word?.trim())) materials.push('Sight word cards');
  if (input.savvas?.vocabulary?.some(v => v.word?.trim())) materials.push('Vocabulary cards / visuals');
  if (input.savvas?.bookPages?.length) materials.push('Story pages / book (uploaded)');

  return {
    schemaVersion: '1.1',
    grade: 'K',
    subject: input.subject || 'English Language Arts',
    title,
    date: input.date,
    objectives,
    materials,
    ieSuggestions: buildIESuggestions(input),
    blocks: [
      {
        title: 'Welcome + Song',
        minutes: 5,
        teacherSays: [
          'Good morning friends! Let’s get our brains ready for learning.',
          `Today is ${input.date}.`,
        ],
        studentsDo: ['Sing along and point/track when appropriate.'],
      },
      {
        title: 'UFLI — Phonemic Awareness',
        minutes: input.ufli?.phonemicAwarenessTime ?? 2,
        teacherSays: ['Listen to the sounds. Now you try.'],
        checksForUnderstanding: ['Students can isolate/segment as prompted.'],
        differentiation: {
          intervention: ['Use mouth cues + picture support.'],
          extension: ['Have students create their own example word.'],
        },
      },
      {
        title: 'UFLI — Drills + New Concept',
        minutes:
          (input.ufli?.visualDrillTime ?? 3) +
          (input.ufli?.auditoryDrillTime ?? 5) +
          (input.ufli?.blendingDrillTime ?? 5) +
          (input.ufli?.newConceptTime ?? 15),
        teacherSays: [
          input.phonicsConcept ? `Our phonics focus is: ${input.phonicsConcept}.` : 'Let’s learn our new phonics skill.',
          'Watch me. Now we do it together. Now you try.',
        ],
        studentsDo: ['Respond chorally, then independently.'],
        checksForUnderstanding: ['Cold-call 3 students for quick checks.', 'Thumbs up/down check.'],
      },
      {
        title: 'Sight Words',
        minutes: 5,
        teacherSays: ['Let’s read our sight words quickly!'],
        studentsDo: ['Read chorally, then whisper-read to self.'],
        materials: ['Sight word cards / slide'],
      },
      {
        title: 'Read Aloud / Shared Reading',
        minutes: 15,
        teacherSays: [
          input.storyTitle ? `We are reading: ${input.storyTitle}.` : 'We are reading our story.',
          'Listen for the important parts. I will stop to ask questions.',
        ],
        studentsDo: ['Listen, turn-and-talk, answer questions.'],
        materials: ['Story text / book pages / slide'],
        checksForUnderstanding: ['Turn-and-talk prompt', 'Ask 2 text-based questions'],
      },
      {
        title: 'Vocabulary + Discussion',
        minutes: 10,
        teacherSays: ['Let’s learn some new words from our story.'],
        studentsDo: ['Repeat word, act it out, use in a sentence frame.'],
        materials: ['Vocabulary visuals'],
      },
      {
        title: 'Writing / Quick Check',
        minutes: 10,
        teacherSays: ['Write one sentence using our phonics skill or a vocabulary word.'],
        studentsDo: ['Write, then share with a partner.'],
        checksForUnderstanding: ['Collect 3 samples', 'Listen for complete sentence and phonics accuracy'],
      },

      ,
      {
        title: 'I/E Small Groups (Tiered Support)',
        minutes: 20,
        teacherSays: [
          'Meet with Tier 3 first for the highest-priority skill work. Keep it fast and explicit.',
          'Then meet with Tier 2 for supported practice aligned to today’s skill.',
          'Enrichment group works on extension tasks independently or with a quick check-in.'
        ],
        studentsDo: [
          'Rotate to your small-group table when called.',
          'Work quietly and stay on the assigned task card.'
        ],
        differentiation: {
          intervention: ['Tier 3: shorter word lists, more blending/segmenting, more immediate feedback.'],
          ell: ['Use picture support, gestures, and sentence frames during discussion.'],
          extension: ['Add challenge words / writing sentence using today’s pattern.'],
        },
      },
      {
        title: 'Centers / Rotations',
        minutes: 25,
        teacherSays: [
          'Introduce each center quickly with a model.',
          'Review noise level and what to do when finished.',
        ],
        studentsDo: [
          'Complete your center task card.',
          'Clean up and rotate when the timer rings.',
        ],
        materials: [
          'Center task cards',
          'Timer',
        ],
        checksForUnderstanding: [
          'Students can restate the center directions in their own words.',
        ],
        differentiation: {
          intervention: ['Provide a simplified task card with fewer steps.'],
          extension: ['Add an optional “challenge” step to the task card.'],
        },
      }
    ],
    notes: {
      pacingTips: ['If time is short, combine Vocabulary + Discussion.', 'Keep choral responses fast and upbeat.'],
      classroomManagement: ['Use “1-2-3 eyes on me” transitions between blocks.', 'Pre-place materials to reduce downtime.'],
    },
  };
}
