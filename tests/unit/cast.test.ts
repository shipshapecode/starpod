import { describe, expect, it } from 'vitest';
import { sortCast, voiceFor } from 'starpod/src/lib/cast';

const person = (name: string, isHost: boolean) => ({ id: name, img: null, isHost, name });

describe('sortCast', () => {
  const hosts = ['RobbieTheWagner', 'Chuck Carpenter', 'Adam Argyle'];

  it('credits this episode’s hosts first (configured order, then guest hosts), then guests', () => {
    const sorted = sortCast(
      [
        person('Zed Guest', false),
        person('Adam Argyle', true),
        person('Nick Taylor', true),
        person('Amy Guest', false),
        person('RobbieTheWagner', true)
      ],
      hosts
    );
    expect(sorted.map((p) => p.name)).toEqual([
      'RobbieTheWagner',
      'Adam Argyle',
      'Nick Taylor',
      'Amy Guest',
      'Zed Guest'
    ]);
  });

  it('credits a regular host who appeared as a guest among the guests', () => {
    const sorted = sortCast(
      [person('Adam Argyle', false), person('Chuck Carpenter', true), person('RobbieTheWagner', true)],
      hosts
    );
    expect(sorted.map((p) => `${p.name}${p.isHost ? '' : ' (guest)'}`)).toEqual([
      'RobbieTheWagner',
      'Chuck Carpenter',
      'Adam Argyle (guest)'
    ]);
  });
});

describe('voiceFor', () => {
  const cues = [
    { s: 0, t: 'Hi', v: 0, n: 'Robbie Wagner' },
    { s: 5, t: 'Hey', v: 1, n: 'Adam Argyle' },
    { s: 9, t: 'Hello', v: 2, n: 'Denver Cramer' }
  ];

  it('matches people to the voice they speak in, loosely by first name', () => {
    expect(voiceFor('RobbieTheWagner', cues)).toBe(0);
    expect(voiceFor('Adam Argyle', cues)).toBe(1);
  });

  it('matches a shared surname when first names differ', () => {
    const chuck = [
      { s: 0, t: 'Hi', v: 0, n: 'Chuck Carpenter' },
      { s: 5, t: 'Hey', v: 1, n: 'Adam Argyle' }
    ];
    expect(voiceFor('Charles William Carpenter III', chuck)).toBe(0);
    expect(voiceFor('Robbie Wagner', chuck)).toBeUndefined();
  });

  it('prefers an exact name over a loose first-name match', () => {
    const adams = [
      { s: 0, t: 'Hi', v: 0, n: 'Adam Smith' },
      { s: 5, t: 'Hey', v: 1, n: 'Adam Argyle' }
    ];
    expect(voiceFor('Adam Argyle', adams)).toBe(1);
    expect(voiceFor('Adam Smith', adams)).toBe(0);
  });

  it('gives no voice to guests outside the two main voices, or without a transcript', () => {
    expect(voiceFor('Denver Cramer', cues)).toBeUndefined();
    expect(voiceFor('Robbie Wagner', null)).toBeUndefined();
  });
});
