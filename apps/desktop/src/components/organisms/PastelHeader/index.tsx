import * as Styled from './styled';

import {
  BsArrowRepeat,
  BsChevronLeft,
  BsFillLightbulbFill,
  BsFillLightbulbOffFill,
  BsHouseDoor,
  BsPlus,
  BsQuestionLg,
  BsSearch,
} from 'react-icons/bs';
import React, { useCallback, useState } from 'react';
import { addNewColor, addNewPaletts, addPalettsNewColor, setSelectedMenu } from '../../../reducers/pastel.reducer';
import { restartIntro, setTheme } from '../../../reducers/user.reducer';
import { useDispatch, useSelector } from 'react-redux';

import { PATHS } from '../../../constants';
import { RootState } from '../../../reducers';
import { useInput } from '../../../hooks';
import { useNavigate } from 'react-router-dom';

export default React.memo(function PastelHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { configurations } = useSelector((state: RootState) => state.user);
  const { paletts, currentViewedPaletts, menus, selectedHex, selectedMenu } = useSelector(
    (state: RootState) => state.pastel,
  );
  const [search, changeSearch, setSearch] = useInput<string>('');
  const [searchError, setSearchError] = useState<boolean>(false);

  const goBack = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      if (selectedMenu.isDetail) {
        navigate(-1);
      }
    },
    [selectedMenu, navigate],
  );

  const resetLocalStorage = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      localStorage.clear();
      navigate(PATHS.MAIN);
      window.location.reload();
    },
    [navigate],
  );

  const addPaletteOrColor = useCallback(() => {
    if (selectedMenu.isDetail && currentViewedPaletts) {
      dispatch(
        addPalettsNewColor({
          id: currentViewedPaletts,
          color: {
            hex: selectedHex,
            removable: true,
          },
        }),
      );
    } else if (selectedMenu.uid === 3) {
      dispatch(
        addNewColor({
          title: 'Untitled Color',
          hex: selectedHex,
          removable: true,
        }),
      );
    } else {
      dispatch(
        addNewPaletts({
          id: paletts[paletts.length - 1].id + 1,
          uid: selectedMenu.uid === 2 ? 1 : selectedMenu.uid,
          title: 'Untitled Palette',
          colors: [{ hex: selectedHex, removable: true }],
          removable: true,
        }),
      );
    }
  }, [dispatch, paletts, currentViewedPaletts, selectedHex, selectedMenu]);

  const searchPaletts = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setSearchError(false);
      if ('key' in e) {
        if (e.key === 'Enter') {
          if (search.length === 0) return setSearchError(true);

          dispatch(
            setSelectedMenu({
              uid: -1,
              title: search,
              iconKey: -1,
              removable: false,
            }),
          );
          navigate(PATHS.PASTEL);
        }
      } else {
        e.preventDefault();
        e.stopPropagation();

        if (search.length === 0) return setSearchError(true);

        dispatch(
          setSelectedMenu({
            uid: -1,
            title: search,
            iconKey: -1,
            removable: false,
          }),
        );
        navigate(PATHS.PASTEL);
      }
    },
    [search, navigate, dispatch],
  );

  const endSearch = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      dispatch(setSelectedMenu(menus[0].children[0]));
      setSearch('');
      setSearchError(false);
    },
    [dispatch, menus, setSearch],
  );

  const changeColorTheme = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      const theme = configurations.theme === 'light' ? 'dark' : 'light';
      dispatch(setTheme(theme));
    },
    [dispatch, configurations],
  );

  const goHome = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      navigate(PATHS.MAIN);
    },
    [navigate],
  );

  const startIntro = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      dispatch(restartIntro(false));
      dispatch(restartIntro(true));
      navigate(PATHS.PASTEL);
    },
    [dispatch, navigate],
  );

  return (
    <Styled.Container className='piystel-1 p-4 flex items-center justify-between'>
      <div className='flex items-center'>
        <div onClick={goBack} style={{ color: 'var(--color-pastel-text-secondary)' }} className='cursor-pointer mr-2'>
          <BsChevronLeft />
        </div>
        <div className='piystel-2' style={{ color: 'var(--color-pastel-text)' }}>
          {selectedMenu.title}
        </div>
        {selectedMenu.uid === -1 && (
          <div
            onClick={endSearch}
            className='ml-4 text-sm cursor-pointer border rounded-md p-1'
            style={{ color: 'var(--color-pastel-text)' }}>
            검색 종료
          </div>
        )}
      </div>
      <div style={{ color: 'var(--color-pastel-text)' }} className='flex items-center'>
        <div className='piystel-3 mr-2 cursor-pointer hover:bg-slate-500 hover:rounded-md' onClick={startIntro}>
          <BsQuestionLg size={20} />
        </div>
        <div className='piystel-4 mr-2 cursor-pointer hover:bg-slate-500 hover:rounded-md' onClick={goHome}>
          <BsHouseDoor size={20} />
        </div>
        <div className='piystel-5 mr-2 cursor-pointer hover:bg-slate-500 hover:rounded-md' onClick={changeColorTheme}>
          {configurations.theme === 'light' ? <BsFillLightbulbFill size={20} /> : <BsFillLightbulbOffFill size={20} />}
        </div>
        <div className='piystel-6 mr-2 cursor-pointer hover:bg-slate-500 hover:rounded-md' onClick={resetLocalStorage}>
          <BsArrowRepeat size={20} />
        </div>
        <div className='piystel-7 mr-2 cursor-pointer hover:bg-slate-500 hover:rounded-md' onClick={addPaletteOrColor}>
          <BsPlus size={20} />
        </div>
        <div
          className={`${
            searchError ? 'animate-bounce border-rose-700 ' : ' '
          } piystel-8 flex items-center p-1 w-48 border rounded-md`}>
          <div className='mr-1 ml-1 cursor-pointer' onClick={searchPaletts}>
            <BsSearch size={12} />
          </div>
          <div>
            <input
              value={search}
              onChange={changeSearch}
              onKeyDown={searchPaletts}
              onBlur={() => {
                setSearchError(false);
              }}
              className={`${
                searchError ? 'text-rose-700 ' : ' '
              } bg-transparent focus:outline-none w-full placeholder:text-sm`}
              placeholder='Search'
            />
          </div>
        </div>
      </div>
    </Styled.Container>
  );
});
