import * as I from '../../../interfaces';

import React, { useCallback } from 'react';

import PalettsItem from '../../atoms/PalettsItem';

interface Props {
  paletts: I.Paletts[];
}

export default function Paletts({ paletts }: Props) {
  const drawPalettsItem = useCallback((item: I.Paletts, index: number) => {
    return <PalettsItem key={index} item={item} />;
  }, []);

  return (
    <div className='flex flex-wrap justify-between items-center' style={{ height: '100%' }}>
      {paletts.map(drawPalettsItem)}
    </div>
  );
}
