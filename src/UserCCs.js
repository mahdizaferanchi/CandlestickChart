import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import CreditCard from './CreditCard';
import CCForm from './CCForm';
import { Formik, Field, Form } from 'formik';

function UserCCs(props) {

	const [open, setOpen] = useState(false);
	const [cards, setCards] = useState(
		[
			{
				"bank": 'صادرات',
				"number": '6037691111111111',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111112',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111113',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111114',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111115',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111116',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111117',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111118',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111119',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111120',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
			{
				"bank": 'صادرات',
				"number": '6037691111111121',
				'cvv2': '2234',
				'year': '02',
				'month': '12',
			},
		]);
	const [pageSize, setPageSize] = useState(5)
	const [page, setPage] = useState(0)
	const checkDuplicateCCnum = (num) => {
		return cards.filter(card => card.number === num).length === 0	
	} 
	const getCC = cardObj => {
		return (
			<CreditCard 
				bank={cardObj.bank}
				number={cardObj.number}
				cvv2={cardObj.cvv2}
				year={cardObj.year}
				month={cardObj.month}
				onDelete={() => 
					setCards(cards => cards.filter(card => card.number !== cardObj.number))
				}
				onEdit={(newCard, id) => {
					let idx = cards.findIndex(el => el.number === id)
					setCards(cards.slice(0, idx).concat([newCard]).concat(cards.slice(idx + 1)))
				}}
				checkDuplicateCCnum={checkDuplicateCCnum}
				key={cardObj.number}
			/>)
	}

	return(
		<div dir='rtl' style={{'margin': '1rem'}}>
			{cards.slice(page * pageSize, page * pageSize + pageSize).map(card => getCC(card))}
			<button 
				onClick={() => setPage(Math.max(page - 1, 0))}>
					صفحه قبل
			</button>
			<button 
				onClick={() => setPage(Math.min(page + 1, Math.floor((cards.length - 1) / pageSize)))}>
					صحفه بعد
			</button>
			<Formik
				enableReinitialize={true}
				validate={(values) => {
					console.log(Math.floor((cards.length - 0.1) / pageSize))
					if (values.currentPage - 1 < 0 
						|| values.currentPage - 1 > Math.floor((cards.length - 0.1) / pageSize)) {
						return {currentPage: 'error'}
					}
				}}
				initialValues={{
					currentPage: page + 1,
				}}
				onSubmit={values => {
					setPage(values.currentPage - 1)
				}}
			>
				{props => (
					<Form>
						<Field type='number' name='currentPage'/>
						<button type='submit'>برو به صفحه</button>
					</Form>
				)}
			</Formik>
			<Formik
				enableReinitialize={true}
				initialValues={{
					currentPageSize: pageSize,
				}}
				validate={(values) => {
					if (values.currentPageSize < 1) {
						return {currentPageSize: 'error'}
					}
				}}
				onSubmit={values => {
					setPageSize(values.currentPageSize)
					setPage(Math.min(Math.floor(cards.length / values.currentPageSize), page))
				}}
			>
				{props => (
					<Form>
						<Field type='number' name='currentPageSize' />
						<button type='submit'>تغییر اندازه صفحه</button>
					</Form>
				)}
			</Formik>
			<button onClick={() => setOpen(true)}>
				افزودن
			</button>
			 <Dialog
		        open={open}
		        // TransitionComponent={Transition}
		        // keepMounted
		        onClose={() => setOpen(false)}
		    >
			    <CCForm 
			    	onSubmit={(newCard, id) => {
				    	setCards(cards.concat([newCard]))
				    	setOpen(false)
			    	}}
			    	onCancel={() => {
			    		setOpen(false)
			    	}}
			    	checkDuplicateCCnum={checkDuplicateCCnum}
			    />
		    </Dialog>
		</div>
		)
}

export default UserCCs;