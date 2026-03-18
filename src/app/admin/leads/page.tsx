import { prisma } from '@/lib/prisma'

export default async function LeadsPage() {
  const leads = await prisma.downloadLead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Leads téléchargement</h1>
      {leads.length === 0 ? (
        <p className="text-muted-foreground">Aucun lead pour le moment.</p>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className="border border-border p-4">
              <p className="font-light">{lead.firstName} {lead.lastName}</p>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              {lead.photoTitle && <p className="text-xs text-muted-foreground mt-1">Photo: {lead.photoTitle}</p>}
              <p className="text-xs text-muted-foreground/60 mt-1">{new Date(lead.createdAt).toLocaleString('fr-FR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
