'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../scss/components/TipsForShareholders.scss';

export default function TipsForShareholders({ data }) {
  // Default data (will be replaced by Strapi)
  const tipsData = data || {
    sections: [
      {
        id: 'nomination',
        title: 'Nomination',
        content: [
          'The facility of nomination can be availed by shareowners who are individuals, holding shares in single or joint names up to two persons. The shares vest in the nominee on the death of the shareholder and joint shareholder(s). It is expedient to nominate, particularly in single holdings to avoid problems in future.',
          'Nomination can be made using the prescribed form 2B, available on this site, under "download forms"',
          'Nominee can be a minor, who has to be represented by a guardian',
          'Society, Body corporate, Partnership firm, Karta of HUF or Power of attorney holder cannot be a nominee',
          'The nomination can be altered or canceled at any point of time',
          'It would be advisable to maintain a copy of the nomination form along with the confirmation of registration by the Company/DP',
          'You are requested to quote the nomination details to:',
          'Your DP in case shares in demat mode',
          'Company\'s RTA i.e. MUFG Intime India Pvt. Ltd. in case of physical holding',
          { text: 'Nomination Registration Form SH13 – ', link: { text: 'Click here', url: '/assets/forms/W-Link_SH-13_Reg of Nomination & ISR-3_Opt-Out_.pdf' } }
        ]
      },
      {
        id: 'ecs',
        title: 'Electronic clearing service for dividends',
        content: [
          'This facility enables the dividend payable, to be credited to your bank account provided by you, through RBI\'s National Electronic Clearing Cell. ECS offers the following benefits to the shareowners:',
          'Immediate credit of dividend directly into your bank account',
          'No need to fill up pay-in-slip and deposit warrant into bank',
          'Safeguard against misplacement or fraudulent encashment of warrant',
          'Credit entry in pass book/statement issued by your banker',
          'Intimation by Company upon remittance of dividend through NECS'
        ]
      },
      {
        id: 'factors-ecs',
        title: 'Factors in ECS:',
        content: [
          'NECS is currently available at major cities/centres. Wherever NECS facility is not available, the dividend is paid by means of warrants',
          'To avail NECS you would have to quote your bank, branch, account number and the nine-digit MICR code, IFSC code printed on your cheque book',
          'To obtain correct credit, it is very vital that your bank account details and noted correctly. It would be advisable to attach a copy of your cheque leaf/cancelled cheque leaf while requesting to note the NECS. It would be ideal to verify the details recorded with DP/Company',
          'In the event NECS not available, it would be advisable to request the Company to print your bank account details on the dividendwarrant – this helps prevent fraudulent encashment',
          'Reconcile your passbook/statement',
          'NECS information has to be quoted to:',
          'Your DP in case share in demat mode',
          'Company\'s RTA i.e. MUFG Intime India Pvt. Ltd. in case of physical holding'
        ]
      },
      {
        id: 'demat',
        title: 'Dematerialised shares',
        content: [
          'While it is ideal to hold the shares in demat mode in view of the several benefits that it confers, it is worthwhile to:',
          'Reconcile your records regularly. Monitor your transaction through the statements provided by your DP. Discrepancy (if any) should be immediately brought to the attention of DP',
          'Do not merely confirm balances in your account, tally the transactions in the transaction statement. Confirm there are no unauthorised transactions',
          'You may mark unresolved complaints to the Depositories',
          'Use the facility of freezing your account when you do not intend to operate the account for certain time. Defreeze the account before commencing operation',
          'Keep the delivery instruction forms under lock and key',
          'You have the option to select the DP. Convenience, Comfort and Cost are some important criteria for selecting the DP',
          'Guide for investors, covering various facets of demat holdings are available with the depositories'
        ]
      }
    ]
  };

  return (
    <section className="tips-for-shareholders">
      <div className="tips-for-shareholders__container">
        {tipsData.sections.map((section, sectionIndex) => {
          // Determine section class based on bgColor or id
          const sectionClass = section.bgColor === 'ecs' || section.id === 'ecs' 
            ? 'tips-for-shareholders__section--ecs' 
            : '';
          
          return (
            <div 
              key={section.id || sectionIndex} 
              className={`tips-for-shareholders__section ${sectionClass}`}
            >
              <h2 className="tips-for-shareholders__title">{section.title}</h2>
              <div className="tips-for-shareholders__content">
                {section.content ? (
                  // Render markdown content using ReactMarkdown
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                      }}
                  >
                    {section.content}
                  </ReactMarkdown>
                ) : (
                  // Fallback: render array of content items (old format)
                  Array.isArray(section.content) && section.content.map((paragraph, paraIndex) => {
                    // Handle paragraph with link object
                    if (typeof paragraph === 'object' && paragraph.link) {
                      return (
                        <p key={paraIndex} className="tips-for-shareholders__paragraph">
                          {paragraph.text}
                          <Link href={paragraph.link.url} className="tips-for-shareholders__link">
                            {paragraph.link.text}
                          </Link>
                        </p>
                      );
                    }
                    // Handle regular string paragraph
                    return (
                      <p key={paraIndex} className="tips-for-shareholders__paragraph">
                        {paragraph}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

