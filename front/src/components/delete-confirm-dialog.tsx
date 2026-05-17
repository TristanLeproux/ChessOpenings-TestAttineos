import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Opening } from '@/types/opening'

interface DeleteConfirmDialogProps {
  opening: Opening | null
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  opening,
  isPending,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={opening !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose()
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Supprimer cette ouverture ?</DialogTitle>
          <DialogDescription>
            {opening && (
              <>
                Cette action est irréversible.{' '}
                <strong className="text-foreground">{opening.name}</strong> sera
                définitivement supprimée.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Suppression…' : 'Supprimer'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            autoFocus
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
