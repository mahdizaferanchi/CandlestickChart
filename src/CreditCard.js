import React, { useState } from 'react';
import './CSS/CreditCard.css';
import CCForm from './CCForm';
import Dialog from '@material-ui/core/Dialog';

function CreditCard(props) {
	const [openEdit, setEditOpen] = useState(false)
	const [openDelete, setDeleteOpen] = useState(false)
	const formatCCnum = (num) => {
		let result = num.slice(0, 4).concat(' ')
		result = result.concat(num.slice(4, 8)).concat(' ')
		result = result.concat(num.slice(8, 12)).concat(' ')
		result = result.concat(num.slice(12, 16))
		return result
	}
	return(
		<div>
			<div className='card' dir='rtl'>
				<div className='card-item' style={{'fontWeight': 'bold'}}>{props.bank}</div>
				<div className='card-item' dir='ltr'>{formatCCnum(props.number)}</div>
				<div className='card-item'>{props.cvv2}</div>
				<div className='card-item'>{props.year}/{props.month}</div>
				<div>
					<button className='card-button' onClick={() => setDeleteOpen(true)}>حذف</button>
					<button className='card-button' onClick={() => setEditOpen(true)}>ویرایش</button>
				</div>
			</div>
			<Dialog
		        open={openEdit}
		        // TransitionComponent={Transition}
		        keepMounted
		        onClose={() => setEditOpen(false)}
		    >
			    <CCForm
			    	bank={props.bank}
			    	number={props.number}
			    	cvv2={props.cvv2}
			    	year={props.year}
			    	month={props.month}
			    	onSubmit={(card, id) => {
			    		props.onEdit(card, id)
				    	// setEditOpen(false)
			    	}}
			    	onCancel={() => {
			    		setEditOpen(false)
			    	}}
			    	checkDuplicateCCnum={props.checkDuplicateCCnum}
			    />
		    </Dialog>
		    <Dialog
		        open={openDelete}
		        // TransitionComponent={Transition}
		        keepMounted
		        onClose={() => setDeleteOpen(false)}
		    >
		    	<div className="delete-dialog">
				    <h3>آیا  از حذف این کارت اطمینان دارید؟</h3>
				    <button className="card-button" onClick={() => {
				    	props.onDelete()
				    	setDeleteOpen(false)
				    }}>
				    	حذف<
				    /button>
				    <button className="card-button" onClick={() => setDeleteOpen(false)}>
				    	لعو
				    </button>
			    </div>
		    </Dialog>
		</div>
		)
}

export default CreditCard;