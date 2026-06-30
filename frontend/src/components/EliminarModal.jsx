import { AlertDialog, Button, Spinner} from "@heroui/react";


export default function EliminarModal({ isOpen, onClose, onConfirm, isPending }) {
    return (
    <AlertDialog 
    isOpen={isOpen} 
    onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
      }}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="warning" />
              <AlertDialog.Heading>Confirmar Eliminación</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                ¿Estás seguro de que deseas eliminar este registro? Esta acción es irreversible y los datos no podrán ser recuperados.
                    
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button 
                        variant="tertiary" 
                        onPress={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    
                    <Button 
                        className="bg-warning text-white hover:bg-warning-hover" 
                        onPress={onConfirm}
                        isPending={isPending}
                    >
                        {({isPending}) => (
                            <>
                                {isPending ? <Spinner color="white" size="sm" /> : ""}
                                {isPending ? "Eliminando..." : "Sí, eliminar"}
                            </>
                        )}
                    </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
    );
}
