import React, { useState } from 'react';
import './CSS/CreditCard.css';
import CCForm from './CCForm';
import Dialog from '@material-ui/core/Dialog';

function CreditCard(props) {
	const [open, setOpen] = useState(false)
	return(
		<div>
			<div className='card' dir='rtl'>
				<div className='card-item' style={{'fontWeight': 'bold'}}>{props.bank}</div>
				<div className='card-item'>{props.number}</div>
				<div className='card-item'>{props.cvv2}</div>
				<div className='card-item'>{props.year}/{props.month}</div>
				<div>
					<button className='card-button' onClick={() => props.onDelete()}>حذف</button>
					<button className='card-button' onClick={() => setOpen(true)}>ویرایش</button>
				</div>
			</div>
			<Dialog
		        open={open}
		        // TransitionComponent={Transition}
		        keepMounted
		        onClose={() => setOpen(false)}
		    >
			    <CCForm
			    	bank={props.bank}
			    	number={props.number}
			    	cvv2={props.cvv2}
			    	year={props.year}
			    	month={props.month}
			    	onSubmit={(card, id) => {
			    		props.onEdit(card, id)
			    		setOpen(false)
			    	}}
			    />
		    </Dialog>
		</div>
		)
}

export default CreditCard;