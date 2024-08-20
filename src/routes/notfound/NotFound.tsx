import MdxLayout from '@/components/layout/MdxLayout';

export let NotFound = () => {
  return (
    <MdxLayout>
      <h1>404 Not Found</h1>
      <p>
        <a href="https://www.rfc-editor.org/rfc/rfc9110#status.404">
          https://www.rfc-editor.org/rfc/rfc9110#status.404
        </a>
      </p>
      <p>
        The 404 (Not Found) status code indicates that the origin server did not
        find a current representation for the{' '}
        <a href="https://www.rfc-editor.org/rfc/rfc9110#target.resource">
          target resource
        </a>{' '}
        or is not willing to disclose that one exists. A 404 status code does
        not indicate whether this lack of representation is temporary or
        permanent; the{' '}
        <a href="https://www.rfc-editor.org/rfc/rfc9110#status.410">
          410 (Gone)
        </a>{' '}
        status code is preferred over 404 if the origin server knows, presumably
        through some configurable means, that the condition is likely to be
        permanent.
      </p>
      <p>
        A 404 response is heuristically cacheable; i.e., unless otherwise
        indicated by the method definition or explicit cache controls (see{' '}
        <span>
          <a href="https://www.rfc-editor.org/rfc/rfc9111#section-4.2.2">
            Section 4.2.2
          </a>{' '}
          of [
          <a href="https://www.rfc-editor.org/rfc/rfc9110#CACHING">CACHING</a>]
        </span>
        ).
      </p>
    </MdxLayout>
  );
};
