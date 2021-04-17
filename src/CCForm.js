import { Formik, Field, Form } from 'formik';
import './CSS/CCForm.css'

function CCForm(props) {

	const bankCCNum = {
		'صادرات': '603769',
		'پاسارگاد': '502229',
		'ملی': '603799',
	}
	const validateCCNumber = (num, bank) => {
		return bankCCNum[bank] !== num.slice(0, 6)
	}

	const validate = (values) => {
		const errors = {}
		if (!values.cvv2.length) {
			errors.cvv2 = 'ورود cvv2 الزامی است.'
		}
		if (!values.bank) {
			errors.bank = 'انتخاب بانک الزامی است.'
		}
		if (!values.year) {
			errors.year = 'ورود سال انقضا الزامی است.'
		}
		if (!values.month) {
			errors.month = 'ورود ماه انقضا الزامی است.'
		}
		if (!values.number) {
			errors.number = 'ورود شماره کارت الزامی است.'
		} else if (values.number.length !== 16) {
			errors.number = 'شماره کارت بانکی باید 16 رقم باشد.'
		} else if (values.bank && validateCCNumber(values.number, values.bank)) {
			errors.number = 'شماره کارت بانکی با  بانک انتخاب شده تطابق ندارد.'
		}

		return errors
	}

	const focusChange = (e) => {
		if (e.target.value.length === 2) {
			 e.target.nextElementSibling.focus();
		}
	}

	return(
		<Formik
			initialValues={{
				bank: props.bank || '',
				number: props.number || '',
				cvv2: props.cvv2 || '',
				year: props.year || '',
				month: props.month || '',
				}}
			validate={validate}
			onSubmit={values => {
					props.onSubmit(values, props.number || 0)
				}}
		>
			{props => (
				<div className='form' dir='rtl'>
					<Form>
						<div className='form-label'>بانک</div>
						<div className='radio-values'>
							<label className="" dir='rtl'>
								<Field type="radio" name="bank" value="صادرات" />
								<span className='radio-value'>صادرات</span>
				            </label>
				            <label className="" dir='rtl'>
								<Field type="radio" name="bank" value="پاسارگاد" />
								<span className='radio-value'>پاسارگاد</span>
				            </label>
				            <label className="" dir='rtl'>
								<Field type="radio" name="bank" value="ملی" />
								<span className='radio-value'>ملی</span>
				            </label>
						</div>
						{
							props.touched.bank && props.errors.bank &&
							<div className='error'>{props.errors.bank}</div>
						}
						<label className="form-label" htmlFor="number">شماره کارت</label>
						<Field className='form-input' id="number" name="number"/>
						{
							props.touched.number && props.errors.number &&
							<div className='error'>{props.errors.number}</div>
						}

						<label className="form-label" htmlFor="cvv2">cvv2</label>
						<Field className='form-input' type="password" id="cvv2" name="cvv2"/>
						{
							props.touched.cvv2 && props.errors.cvv2 &&
							<div className='error'>{props.errors.cvv2}</div>
						}

						<label className="form-label" htmlFor="year">تاریخ انقضا</label>
						<div className="exp-date-input">
							<Field className='form-input' id="month" name="month" placeholder="ماه" onInput={(e) => focusChange(e)}/>
							<Field className='form-input' id="year" name="year" placeholder='سال' />
						</div>
						{
							props.touched.month && props.errors.month &&
							<div className='error'>{props.errors.month}</div>
						}
						{
							props.touched.year && props.errors.year &&
							<div className='error'>{props.errors.year}</div>
						}

						<button className="form-submit" type="submit">ثبت</button>
					</Form>
				</div>
			)}
		</Formik>
		);
}

export default CCForm;