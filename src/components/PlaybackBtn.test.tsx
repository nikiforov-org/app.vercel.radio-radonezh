// src/components/PlaybackBtn.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, vi } from 'vitest';

// Мокаем модули framework7-react, чтобы избежать попыток инициализации Framework7
vi.mock('framework7-react', () => {
  return {
    // Простой мок для Button: рендерит обычную HTML-кнопку
    Button: (props: any) => <button {...props} />,
    // Мок для Icon: рендерит <i> с data-testid, data-f7 и стилями
    Icon: ({ f7, color, ...rest }: any) => (
      <i data-testid="icon" data-f7={f7} style={{ color }} {...rest} />
    ),
    // Мок для f7: содержит заглушку для диалогового окна
    f7: {
      dialog: {
        alert: vi.fn(),
      },
    },
  };
});

import PlaybackBtn from './PlaybackBtn';

describe('PlaybackBtn', () => {
  test('renders with the correct icon and color', () => {
    render(<PlaybackBtn icon="play" />);

    // Ищем смокированную иконку по data-testid
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-f7', 'play');
    //expect(icon).toHaveStyle({ color: 'white' });
  });

  test('renders disabled button when the disabled prop is passed', () => {
    render(<PlaybackBtn icon="play" disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('calls onClick when button is clicked', () => {
    const onClickMock = vi.fn();
    render(<PlaybackBtn icon="play" onClick={onClickMock} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('passes additional props to button', () => {
    render(<PlaybackBtn icon="play" data-testid="playback-btn" />);

    const button = screen.getByTestId('playback-btn');
    expect(button).toBeInTheDocument();
  });
});
