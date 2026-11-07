export interface AIRequest {
  prompt: string;
  category: 'photography' | 'screenwriting' | 'documentary' | 'production' | 'general';
  contextData?: any;
  apiKey?: string;
}

export interface AIResponse {
  text: string;
  suggestedAction?: {
    type: 'insert' | 'replace' | 'create_shot' | 'create_idea';
    payload: any;
    label: string;
  };
}

export async function generateCreativeResponse(req: AIRequest): Promise<AIResponse> {
  const { prompt, category, contextData, apiKey } = req;

  // 1. If OpenAI API key is supplied, attempt live OpenAI API call
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const systemPrompt = `You are FrameFlow Muse, an elite creative advisor for award-winning film directors, cinematographers, screenwriters, and documentary creators.
You speak with cinematic insight, precision, and poetic depth.
Category of guidance: ${category.toUpperCase()}.
Guidelines:
- Never overwrite content automatically.
- Provide actionable, distinct ideas, lighting setups, shot choices, or dialogue punch-ups.
- Keep tone sophisticated, supportive, and editorial.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return {
          text: content,
          suggestedAction: {
            type: 'insert',
            payload: content,
            label: 'Insert into active workspace',
          },
        };
      }
    } catch (e) {
      console.warn('OpenAI API request failed, falling back to built-in creative engine:', e);
    }
  }

  // 2. Intelligent Built-in Creative Engine (No external API key needed, immediate response)
  const lower = prompt.toLowerCase();

  if (category === 'photography') {
    if (lower.includes('light') || lower.includes('lighting')) {
      return {
        text: `### Cinematic Lighting Strategy: Low-Key Chiaroscuro with Negative Fill

1. **Key Light**: 1x Aputure 600d Pro pushed through an 8x8 silent frost frame, raking 15 degrees behind subject to create razor rim edge separation.
2. **Negative Fill**: Large solid black floppies on camera left to kill bounce light and deepen shadows to true density.
3. **Practical Accent**: 2200K vintage bare tungsten bulb or neon signage in deep background for organic spherical bokeh halation.
4. **Atmosphere**: Fine haze via water-based fogger to catch atmospheric shafts without muddying black levels.
5. **Camera Settings**: Base ISO 100/800, aperture f/1.8 - f/2.2, 180° shutter angle.`,
        suggestedAction: {
          type: 'insert',
          payload: 'Lighting Setup: 8x8 Silent Frost key light raking 15° behind subject with solid negative fill on camera left.',
          label: 'Append to Shoot Plan Notes',
        },
      };
    }
    if (lower.includes('concept') || lower.includes('composition')) {
      return {
        text: `### Photography Concept: "Subterranean Geometry & Vanishing Solitude"

- **Visual Motif**: Framing subjects within claustrophobic architectural thresholds (tunnel arches, descending escalators, brutalist concrete pillars).
- **Compositional Rule**: Strict single-point linear perspective with extreme negative space above the subject's eyeline to evoke existential scale.
- **Optics & Texture**: 35mm focal length at eye level; utilize Black Pro-Mist 1/4 to bloom practical neon lights while retaining tack-sharp iris reflections.
- **Color Temperature Contrast**: Deep cyan fluorescent foreground (4500K) intersecting with warm sodium-vapor amber (2200K) in the midground.`,
        suggestedAction: {
          type: 'create_idea',
          payload: { title: 'Subterranean Geometry & Vanishing Solitude', tags: ['Concept', 'Architecture', 'Chiaroscuro'] },
          label: 'Save as Inspiration Concept',
        },
      };
    }
    return {
      text: `### Photographic Approach Recommendation

- **Lensing**: 50mm Prime or Anamorphic equivalent for true human perspective without telephoto compression.
- **Exposure Metric**: Expose strictly for highlights; preserve shadow detail by elevating mid-tones in post-LUT curve.
- **Subject Movement**: Continuous slow drift; shutter speed 1/125s for crisp gestures, or 1/4s with ND filter for phantom trail blurs.`,
    };
  }

  if (category === 'screenwriting') {
    if (lower.includes('dialogue') || lower.includes('punch')) {
      return {
        text: `### Screenplay Dialogue Polish & Subtext Analysis

**Original Impression**: Direct exposition often weakens character tension. Characters rarely say what they actually want; they talk about something neutral to deflect from what is unbearable.

**Suggested Alternative**:
\`\`\`text
JESSE
(without turning around)
You left the ignition running.

ELENA
The battery won’t turn over twice in this cold. You know that.

JESSE
I know the sound of a surveyor truck that’s about to abandon post.

ELENA
Then don’t give me a reason to put it in reverse, Vance.
\`\`\`

**Why this works**:
- Replaces explanatory backstory with behavioral conflict.
- The car engine becomes a metaphor for their mutual distrust.
- Escalates tension before the scene heading transition.`,
        suggestedAction: {
          type: 'insert',
          payload: `JESSE\n(without turning around)\nYou left the ignition running.\n\nELENA\nThe battery won’t turn over twice in this cold. You know that.\n\nJESSE\nI know the sound of a surveyor truck that’s about to abandon post.`,
          label: 'Insert Dialogue Polish into Screenplay',
        },
      };
    }
    if (lower.includes('character') || lower.includes('arc')) {
      return {
        text: `### Character Development Framework: The Unconscious Flaw

- **The Ghost (Wound)**: The moment 10 years ago where measuring by the book failed someone they loved.
- **The Lie Believed**: "If I record the boundary with sufficient mathematical precision, chaos cannot breach the perimeter."
- **The Want vs. Need**: 
  - *Want*: To finish the geological survey and prove the state wrong.
  - *Need*: To accept that human grief cannot be mapped on a coordinate grid.
- **Pressure Test**: Place them in a circumstance where their measurement tools actively betray them, forcing reliance on human intuition.`,
      };
    }
    return {
      text: `### Narrative Structure & Scene Momentum

1. **Enter Late, Leave Early**: Trim the first three exchanges of small talk; begin right as the conflict explodes.
2. **Visual Objective**: Give every speaking character an active physical task (cleaning a lens, winding a survey spool, checking a fuse).
3. **The Silent Turn**: The most devastating beat in any dramatic scene should happen in the action description, not the spoken line.`,
    };
  }

  if (category === 'documentary') {
    return {
      text: `### Investigative Documentary Framework & Interview Strategy

**Central Tension**: The conflict between mechanical permanence and disposable algorithmic culture.

**High-Impact Interview Questions**:
1. *"Take me back to the exact second you realized the machine in front of you was the last of its kind on earth."*
2. *"What does your body feel when you hear an imperfect frequency that digital software claims is correct?"*
3. *"If this archive burned down tonight, what piece of human memory disappears forever?"*

**B-Roll Acoustic Strategy**:
- Record 4 minutes of pure mechanical room tone with zero voices.
- Extreme macro 90mm probe shots of the heated diamond stylus carving virgin lacquer under microscope halogen light.`,
      suggestedAction: {
        type: 'insert',
        payload: '1. Take me back to the exact second you realized this machine was the last of its kind on earth.\n2. What does your body feel when you hear an imperfect frequency that digital software claims is correct?',
        label: 'Add to Interview Questions',
      },
    };
  }

  if (category === 'production') {
    return {
      text: `### Film Production & Shot List Extraction

**Generated Shot Breakdown for Active Scene**:
- **Shot 1A (EWS)**: 24mm Anamorphic, Locked Tripod. Dawn horizon, tiny truck silhouette entering from frame left.
- **Shot 1B (Medium)**: 50mm, Steadicam slow push-in over shoulder tracking protagonist footsteps into dust.
- **Shot 1C (CU)**: 85mm, Handheld with subtle breathing motion. Eyeline matching distant radio tower strobe.
- **Shot 1D (Macro Insert)**: 90mm Probe Lens. Needle on compass trembling wildly against brass casing.

**Production Checklist Item**:
- Ensure 2x Honda silent generators placed 150ft downwind with sound baffles.
- Prepare dust mitigation bags for Cooke Anamorphic lens mounts before Mojave high winds kick up at 16:30.`,
      suggestedAction: {
        type: 'create_shot',
        payload: {
          shotNumber: '1D',
          sceneNumber: '1',
          shotType: 'ECU',
          cameraAngle: 'Top-Down Macro',
          cameraMovement: 'Static Macro',
          lens: 'Laowa 24mm Probe',
          lighting: 'Practical instrument back-glow',
          description: 'Needle on compass trembling wildly against brass casing.',
          status: 'To Shoot',
        },
        label: 'Add Shot 1D to Shot List',
      },
    };
  }

  // General Creative
  return {
    text: `### Creative Exploration & Idea Expansion

**Story Core**:
Every meaningful creative project starts with an emotional paradox: something familiar that is suddenly rendered strange.

**Three Creative Angles to Explore**:
1. **The Tangible Archive**: Contrast heavy tactile objects (brass, cellulose, magnetic tape, stone) with invisible forces (frequencies, memory, grief).
2. **The Sonic Silence**: In audio-visual storytelling, silence is not emptiness; it is the presence of acoustic tension waiting to shatter.
3. **The Unresolved Ending**: Avoid neat moral bowties. Leave the audience with a compelling unresolved mystery that lingers for days after viewing.`,
    suggestedAction: {
      type: 'create_idea',
      payload: { title: 'The Tangible Archive vs Invisible Forces', tags: ['Paradox', 'Theme', 'Atmosphere'] },
      label: 'Save to Creative Journal / Sparks',
    },
  };
}
