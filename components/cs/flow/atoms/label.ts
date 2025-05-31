import type {
  NodeAtoms,
  NodeCreator,
  OutputValue,
} from '@/components/cs/flow/model/type';
import { atom } from 'jotai';

type LabelAtoms = NodeAtoms<never, never, false>;

export const createLabelAtoms: NodeCreator<LabelAtoms> = (initialValues) => {
  const labelAtom = atom<OutputValue>();

  return {
    type: 'boolean',
    inputAtoms: {},
    outputAtoms: { label: labelAtom },
    effectAtom: undefined,
  };
};
