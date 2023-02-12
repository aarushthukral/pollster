<script lang="ts">
  export let title: string;
  export let description: string;
  export let ogImage: string;
  export let url: string;
</script>

<title>{title}</title>
<meta property="og:title" content={title} />
<meta name="twitter:title" content={title} />
<meta name="description" content={description} />
<meta property="og:description" content={description} />
<meta name="twitter:image" content={ogImage} />
<meta property="og:image:url" content={ogImage} />
<meta property="og:url" content={url} />
