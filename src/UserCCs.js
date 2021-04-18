import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import CreditCard from './CreditCard';
import CCForm from './CCForm';

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
		]);

	const checkDuplicateCCnum = (num) => cards.filter(card => card.number === num).length === 0	
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
			{cards.map(card => getCC(card))}
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