'use client';

import Image from 'next/image';
import { useState } from 'react';
import { VoterResult } from '@/lib/voterService';

import {
  shareSlip,
  downloadVoterSlip,
  printVoterSlip,
} from '@/lib/shareUtils';

import { Button } from '@/components/ui/button';

import {
  X,
  MessageCircle,
  Download,
  Printer,
  Copy,
} from 'lucide-react';


interface Props {

  voter: VoterResult | null;

  isOpen: boolean;

  onClose: () => void;

}


export default function VoterSlipModal({

  voter,

  isOpen,

  onClose,

}: Props) {


  const [copied, setCopied] = useState(false);


  if (!isOpen || !voter) return null;


  const handleCopy = async () => {

    const text =

`BCD Election 2026 Voting Slip

Name: ${voter.name}

Serial No: ${voter.sr_no}

Voter ID: ${voter.voter_id}

Candidate: VAIBHAV JAIN

Ballot No: 136`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);

  };


  return (


<div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4">


<div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">


{/* HEADER */}


<div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-5 flex justify-between">


<div className="flex gap-4">


<div className="relative w-20 h-28 border-2 border-yellow-400 rounded-lg overflow-hidden">


<Image

src="/vibhav_jain.jpeg"

alt="Vaibhav Jain"

fill

className="object-cover"

/>


</div>


<div>


<div className="text-yellow-400 font-bold">

BCD Election 2026

</div>


<div className="text-xl font-bold">

VAIBHAV JAIN

</div>


<div className="text-sm">

Ballot No: 136

</div>


</div>


</div>


<button onClick={onClose}>

<X />

</button>


</div>



{/* BODY */}


<div className="p-5 space-y-4">


{/* VOTER DETAILS */}


<div className="border rounded-lg p-4 bg-gray-50">


<h3 className="font-bold mb-3">

Voter Details

</h3>


<p>

<b>Name:</b> {voter.name}

</p>


<p>

<b>Serial No:</b> {voter.sr_no}

</p>


<p>

<b>Voter ID:</b> {voter.voter_id}

</p>


<p>

<b>Mobile:</b> {voter.mobile}

</p>


<p>

<b>Address:</b> {voter.address}

</p>


</div>



{/* SUPPORT CARD */}


<div className="bg-yellow-400 p-4 rounded-lg text-center">


<div className="font-bold text-lg">

Support Candidate

</div>


<div className="font-bold text-xl">

VAIBHAV JAIN

</div>


<div className="font-bold text-2xl">

Ballot No: 136

</div>


</div>



{/* ACTION BUTTONS */}


<div className="grid grid-cols-2 gap-3">


<Button

onClick={() => shareSlip(voter)}

className="bg-green-600 text-white"

>

<MessageCircle className="w-4 h-4 mr-2"/>

Share

</Button>



<Button

onClick={() => downloadVoterSlip(voter)}

>

<Download className="w-4 h-4 mr-2"/>

Download

</Button>



<Button

onClick={handleCopy}

>

<Copy className="w-4 h-4 mr-2"/>

{copied ? 'Copied' : 'Copy'}

</Button>



<Button

onClick={() => printVoterSlip(voter)}

className="bg-black text-white"

>

<Printer className="w-4 h-4 mr-2"/>

Print

</Button>


</div>


</div>


</div>


</div>


);


}
