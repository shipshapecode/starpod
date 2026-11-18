import { describe, expect, it } from 'vitest';
import {
  factGivesCount,
  matchNames,
  matchPageNames,
  ordinal,
  personFact,
  sortCast,
  speakerFor,
  voiceFor
} from 'starpod/src/lib/cast';

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

  it('matches non-Latin names exactly and never pairs two different ones', () => {
    const names = [
      { s: 0, t: '你好', v: 0, n: '李明' },
      { s: 5, t: '你好', v: 1, n: '张强' }
    ];
    expect(voiceFor('张强', names)).toBe(1);
    expect(voiceFor('王伟', names)).toBeUndefined();
  });

  it('gives no voice to guests outside the two main voices, or without a transcript', () => {
    expect(voiceFor('Denver Cramer', cues)).toBeUndefined();
    expect(voiceFor('Robbie Wagner', null)).toBeUndefined();
  });
});

describe('ordinal', () => {
  it('suffixes like English does, teens included', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101, 111].map(ordinal)).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '101st',
      '111th'
    ]);
  });
});

describe('personFact', () => {
  it("gives a host's tally", () => {
    expect(personFact({ appearance: 40, count: 106, host: true })).toBe(
      'Host · 106 episodes'
    );
  });

  it("marks a guest's first time on the show", () => {
    expect(personFact({ appearance: 1, count: 1, host: false })).toBe(
      'First time on the show'
    );
  });

  it('counts a returning guest from where they first appeared', () => {
    expect(
      personFact({ appearance: 3, count: 3, first: 'Ep 112', host: false })
    ).toBe('3rd appearance · first on Ep 112');
    expect(personFact({ appearance: 1, count: 3, host: false })).toBe(
      'First of 3 appearances'
    );
  });

  it('falls back to role and tally away from an episode', () => {
    expect(personFact({ count: 1, host: false })).toBe('Guest · 1 episode');
    expect(personFact({ count: 106, host: true })).toBe('Host · 106 episodes');
  });
});

describe('factGivesCount', () => {
  it('is true wherever the fact line says how many episodes', () => {
    expect(factGivesCount({ appearance: 40, count: 106, host: true })).toBe(
      true
    );
    expect(factGivesCount({ count: 4, host: false })).toBe(true);
    expect(factGivesCount({ appearance: 1, count: 1, host: false })).toBe(true);
    expect(factGivesCount({ appearance: 1, count: 3, host: false })).toBe(true);
  });

  it("is false for a returning guest's ordinal, which doesn't", () => {
    expect(factGivesCount({ appearance: 3, count: 5, host: false })).toBe(
      false
    );
  });
});

describe('speakerFor', () => {
  const speakers = ['Robbie Wagner', 'Jason', 'Shruti Kapoor'];

  it("finds a host by the configured name or id the transcript doesn't use", () => {
    expect(speakerFor('RobbieTheWagner', speakers)).toBe('Robbie Wagner');
    expect(speakerFor('robbiethewagner', speakers)).toBe('Robbie Wagner');
    expect(speakerFor('Jason Lengstorf', speakers)).toBe('Jason');
  });

  it("prefers the transcript's exact label, then the closest name", () => {
    expect(speakerFor('Shruti Kapoor', speakers)).toBe('Shruti Kapoor');
    expect(speakerFor('Adam Argyle', ['Adam Rackis', 'Adam Argyle'])).toBe('Adam Argyle');
    // A shared surname alone isn't enough for one name on its own.
    expect(speakerFor('Chuck Carpenter', ['Charles William Carpenter III', 'Robbie Wagner'])).toBeUndefined();
  });

  it('leaves someone who never speaks unmatched', () => {
    expect(speakerFor('Dave Rupert', speakers)).toBeUndefined();
  });
});

describe('matchNames', () => {
  it("gives each episode's people their own speaker, not a namesake's (Ep 184, Ep 164)", () => {
    const ep184 = matchNames(
      ['RobbieTheWagner', 'Charles William Carpenter III', 'Travis Wagner'],
      ['Travis Wagner', 'Chuck Carpenter', 'Robbie Wagner', 'Intro'],
      { surnames: true }
    );
    expect(Object.fromEntries(ep184)).toEqual({
      RobbieTheWagner: 'Robbie Wagner',
      'Charles William Carpenter III': 'Chuck Carpenter',
      'Travis Wagner': 'Travis Wagner'
    });
    const ep164 = matchNames(
      ['RobbieTheWagner', 'Charles William Carpenter III', 'Lane Wagner'],
      ['Chuck Carpenter', 'Lane Wagner', 'Robbie Wagner', 'Promo'],
      { surnames: true }
    );
    expect(ep164.get('Lane Wagner')).toBe('Lane Wagner');
    expect(ep164.get('RobbieTheWagner')).toBe('Robbie Wagner');
  });

  it('lights no other guest when the hosts speak, anywhere on the site', () => {
    const speakers = ['Robbie Wagner', 'Adam Argyle'];
    const guests = ['Travis Wagner', 'Lane Wagner', 'Adam Rackis', 'Adam Stacoviak'];
    expect(matchNames(guests, speakers).size).toBe(0);
    expect(matchNames(guests, speakers, { surnames: true }).size).toBe(0);
    expect(Object.fromEntries(matchNames(['RobbieTheWagner', 'Adam Argyle', ...guests], speakers))).toEqual({
      RobbieTheWagner: 'Robbie Wagner',
      'Adam Argyle': 'Adam Argyle'
    });
  });

  it('refuses a guess between equals', () => {
    expect(matchNames(['Adam Argyle', 'Adam Rackis'], ['Adam']).size).toBe(0);
    expect(matchNames(['Adam Argyle'], ['Adam']).get('Adam Argyle')).toBe('Adam');
  });

  it("takes the voice from the person's own speaker, given the cast", () => {
    const cues = [
      { s: 0, t: 'a', n: 'Travis Wagner', v: 0 },
      { s: 1, t: 'b', n: 'Chuck Carpenter', v: 1 },
      { s: 2, t: 'c', n: 'Robbie Wagner', v: 2 }
    ];
    const cast = ['RobbieTheWagner', 'Charles William Carpenter III', 'Travis Wagner'];
    expect(voiceFor('Travis Wagner', cues, cast)).toBe(0);
    expect(voiceFor('Charles William Carpenter III', cues, cast)).toBe(1);
    expect(voiceFor('RobbieTheWagner', cues, cast)).toBeUndefined();
  });
});

describe('matchPageNames', () => {
  const speakers = ['Robbie Wagner', 'Adam Argyle'];
  const guests = ['Travis Wagner', 'Lane Wagner', 'Adam Rackis', 'Adam Stacoviak'];

  it("lights no guest for a host's lines, on any page", () => {
    expect(matchPageNames(guests, speakers).size).toBe(0);
  });

  it('lights every name a page gives the speaker, and only theirs', () => {
    const names = ['RobbieTheWagner', 'Robbie Wagner', 'robbiethewagner', 'Adam Argyle', ...guests];
    expect(Object.fromEntries(matchPageNames(names, speakers))).toEqual({
      RobbieTheWagner: 'Robbie Wagner',
      'Robbie Wagner': 'Robbie Wagner',
      robbiethewagner: 'Robbie Wagner',
      'Adam Argyle': 'Adam Argyle'
    });
  });

  it('keeps a first name that could be either of two people to itself', () => {
    const matched = matchPageNames(['Adam Argyle', 'Adam Rackis', 'Adam'], ['Adam Argyle']);
    expect(Object.fromEntries(matched)).toEqual({ 'Adam Argyle': 'Adam Argyle' });
  });
});
