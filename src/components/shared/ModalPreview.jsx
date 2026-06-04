export const ModalPreview = ({ item, onClose, baseUrl = "http://localhost:8081/uploads" }) => {
  if (!item) return null;
  const fileUrl = item.filePath ? `${baseUrl}/${item.filePath}` : null;
  const isImage = fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i);
  const isPdf = fileUrl?.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between border-b p-4 bg-rose-50">
          <h3 className="text-lg font-bold">{item.title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="p-4 overflow-auto max-h-[70vh]">
          {fileUrl ? (
            isImage ? <img src={fileUrl} alt={item.title} className="max-w-full h-auto mx-auto" />
            : isPdf ? <iframe src={fileUrl} className="w-full h-[500px]" title={item.title} />
            : <div className="text-center text-gray-500">Aperçu non disponible</div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-700">{item.content}</div>
          )}
        </div>
        <div className="border-t p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Fermer</button>
          {fileUrl && <a href={fileUrl} download className="px-4 py-2 bg-rose-500 text-white rounded-lg">Télécharger</a>}
        </div>
      </div>
    </div>
  );
};