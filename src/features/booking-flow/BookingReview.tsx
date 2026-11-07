import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Field, Notice, button, control } from '@/shared/components/Workspace'
import { errorMessage, sendData } from '@/shared/api/resources'
const schema=z.object({rating:z.coerce.number().int().min(1).max(5),comment:z.string().max(2000,'Nội dung tối đa 2.000 ký tự.')})
type Values=z.infer<typeof schema>
export function BookingReview({bookingId}:{bookingId:number}){
 const form=useForm<Values>({resolver:zodResolver(schema),defaultValues:{rating:5,comment:''}})
 const save=useMutation({mutationFn:(values:Values)=>sendData('post','/api/v1/reviews',{bookingId,...values})})
 if(save.isSuccess)return <Notice>Đã gửi đánh giá của bạn.</Notice>
 return <form className="space-y-4 border-t border-brand-border pt-5" onSubmit={form.handleSubmit(values=>save.mutate(values))}>
  <h3 className="font-semibold">Đánh giá lượt đỗ đã hoàn tất</h3>
  <Field label="Mức độ hài lòng"><select className={control} {...form.register('rating')}>{[5,4,3,2,1].map(value=><option key={value} value={value}>{value} sao</option>)}</select></Field>
  <Field label="Nhận xét"><textarea className={control} maxLength={2000} {...form.register('comment')}/></Field>
  {form.formState.errors.comment&&<Notice error>{form.formState.errors.comment.message}</Notice>}
  {save.isError&&<Notice error>{errorMessage(save.error)}</Notice>}
  <button className={button} disabled={save.isPending}>{save.isPending?'Đang gửi…':'Gửi đánh giá'}</button>
 </form>
}
