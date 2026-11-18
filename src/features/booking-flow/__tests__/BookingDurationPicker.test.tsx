import { useState } from 'react'
import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingDurationPicker } from '../BookingDurationPicker'

function mount(initial = 120, disabled = false) {
  function Form() {
    const [minutes, setMinutes] = useState(initial)
    return <fieldset disabled={disabled}><BookingDurationPicker minutes={minutes} onChange={setMinutes}/><output aria-label="Thời lượng đã chọn">{String(minutes)}</output></fieldset>
  }
  return render(<Form/>)
}
afterEach(cleanup)

it('selects the two-hour default and changes duration with a single quick choice', async () => {
  const user = userEvent.setup(); mount()
  expect(screen.getByRole('button', { name: '2 giờ' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.queryByLabelText('Số giờ đỗ')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '30 phút' }))
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('30')
  expect(screen.getByRole('button', { name: '30 phút' })).toHaveAttribute('aria-pressed', 'true')
  await user.click(screen.getByRole('button', { name: '1 ngày' }))
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('1440')
})
it('combines whole hours and half-hours, supports long stays and restores a preset', async () => {
  const user = userEvent.setup(); mount()
  await user.click(screen.getByRole('button', { name: 'Thời lượng khác' }))
  const hours = screen.getByLabelText('Số giờ đỗ')
  await user.clear(hours); await user.type(hours, '25')
  await user.selectOptions(screen.getByLabelText('Thêm phút'), '30')
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('1530')
  await user.click(screen.getByRole('button', { name: '4 giờ' }))
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('240')
  expect(screen.queryByLabelText('Số giờ đỗ')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Thời lượng khác' }))
  expect(screen.getByLabelText('Số giờ đỗ')).toHaveValue(4)
  expect(screen.getByLabelText('Thêm phút')).toHaveValue('0')
})
it('preserves the minute part when hours are empty and rejects fractional hours', async () => {
  const user = userEvent.setup(); mount(90)
  const hours = screen.getByLabelText('Số giờ đỗ')
  await user.clear(hours)
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('NaN')
  expect(screen.getByLabelText('Thêm phút')).toHaveValue('30')
  await user.type(hours, '2')
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('150')
  await user.clear(hours); await user.type(hours, '1.5')
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('NaN')
})
it('supports keyboard selection and inherits the pending form disabled state', async () => {
  const user = userEvent.setup(); const view = mount()
  screen.getByRole('button', { name: '1 giờ' }).focus()
  await user.keyboard('{Enter}')
  expect(screen.getByLabelText('Thời lượng đã chọn')).toHaveTextContent('60')
  view.unmount(); mount(90, true)
  for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
  expect(screen.getByLabelText('Số giờ đỗ')).toBeDisabled()
  expect(screen.getByLabelText('Thêm phút')).toBeDisabled()
})
