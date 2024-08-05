import { InputRule } from 'prosemirror-inputrules';
import { Transaction } from 'prosemirror-state';
import { traakSchema } from '../schemas';
import { MarkType } from 'prosemirror-model';

export function markInputRule(regExp: RegExp, markType: MarkType) {
  return new InputRule(regExp, (state, match, start, end): Transaction => {
    const { tr } = state;
    if (match[1]) {
      tr.replaceRangeWith(
        start,
        end,
        traakSchema.text(match[1], [markType.create()]),
      ).removeStoredMark(markType);
    }
    return tr;
  });
}
